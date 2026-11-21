import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Owner authentication for the admin area.
 *
 * Design decisions, and why:
 *
 * · There is exactly one owner account. This is a single-operator business, so
 *   a user table would be unused weight and another thing to get wrong.
 * · The password is stored as a scrypt hash with a per-install salt, never in
 *   plain text. If no hash is configured the admin area refuses all logins
 *   rather than falling back to a default password.
 * · The session is a signed, expiring HMAC token in an HttpOnly cookie. It
 *   carries only an expiry timestamp — no user data — so it cannot leak
 *   anything if inspected.
 * · Login attempts are rate limited in memory. That is per-instance and resets
 *   on redeploy, which is documented rather than pretended otherwise.
 */

export const SESSION_COOKIE = "elvora_admin_session";

/** Session lifetime: 8 hours. Long enough for a stock update, short enough
 *  that a forgotten session on a shared device expires the same day. */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

const SCRYPT_KEYLEN = 64;

/* ------------------------------- Password --------------------------------- */

/**
 * Hash a password for storage. Used by the `npm run admin:hash` helper so the
 * owner can generate the value for their environment without a UI.
 */
export function hashPassword(password: string, salt?: string): string {
  const useSalt = salt ?? randomBytes(16).toString("hex");
  const derived = scryptSync(password, useSalt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${useSalt}$${derived}`;
}

/**
 * Constant-time password verification.
 *
 * `timingSafeEqual` requires equal-length buffers, so both sides are hashed to
 * a fixed length first; comparing the raw strings would leak length.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const [, salt, expectedHex] = parts;
  try {
    const expected = Buffer.from(expectedHex, "hex");
    if (expected.length !== SCRYPT_KEYLEN) return false;
    const actual = scryptSync(password, salt, SCRYPT_KEYLEN);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* -------------------------------- Session --------------------------------- */

function sessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // A short secret is as bad as none; refuse rather than sign weakly.
  if (!secret || secret.length < 32) return null;
  return secret;
}

interface SessionPayload {
  /** Expiry, as a Unix timestamp in seconds. */
  exp: number;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

/**
 * Create a signed session token: `<expiry>.<signature>`.
 *
 * There is deliberately no user id, email or role in the payload — the token
 * proves "the owner logged in and the session has not expired", and nothing
 * more can be read out of it.
 */
export function createSessionToken(now = Date.now()): string | null {
  const secret = sessionSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

/** Verify a session token. Returns false on tampering, expiry or bad config. */
export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  const secret = sessionSecret();
  if (!secret) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  // Compare signatures in constant time to avoid a timing oracle.
  const expected = Buffer.from(sign(encoded, secret));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length) return false;
  if (!timingSafeEqual(expected, provided)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionPayload;
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 > now;
  } catch {
    return false;
  }
}

/* ------------------------------ Configuration ----------------------------- */

export interface AdminConfigState {
  /** True when both the password hash and session secret are valid. */
  ready: boolean;
  /** Human-readable list of what is missing, for the setup screen. */
  missing: string[];
}

/**
 * Report whether the admin area is usable. Never returns the values, only
 * whether they are present and plausible.
 */
export function adminConfigState(): AdminConfigState {
  const missing: string[] = [];

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    missing.push("ADMIN_PASSWORD_HASH");
  } else if (!hash.startsWith("scrypt$") || hash.split("$").length !== 3) {
    missing.push("ADMIN_PASSWORD_HASH (format must be scrypt$salt$hash)");
  }

  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    missing.push("ADMIN_SESSION_SECRET (at least 32 characters)");
  }

  return { ready: missing.length === 0, missing };
}

/* ------------------------------- Rate limit ------------------------------- */

interface Attempt {
  count: number;
  firstAt: number;
  blockedUntil: number;
}

const attempts = new Map<string, Attempt>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may try again. */
  retryAfter: number;
  remaining: number;
}

/**
 * Check and record a login attempt for a given key (currently the client IP).
 *
 * Five failures within fifteen minutes blocks that key for fifteen minutes.
 * This is in-memory on purpose — adding a store for it would be more moving
 * parts than a single-owner login justifies — and the limitation is stated in
 * the README rather than hidden.
 */
export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  const record = attempts.get(key);

  if (!record) {
    return { allowed: true, retryAfter: 0, remaining: MAX_ATTEMPTS };
  }

  if (record.blockedUntil > now) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
      remaining: 0,
    };
  }

  // Reset a window that has aged out.
  if (now - record.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true, retryAfter: 0, remaining: MAX_ATTEMPTS };
  }

  return { allowed: true, retryAfter: 0, remaining: Math.max(MAX_ATTEMPTS - record.count, 0) };
}

/** Record a failed attempt and block the key if the threshold is reached. */
export function recordFailure(key: string, now = Date.now()): void {
  const record = attempts.get(key);

  if (!record || now - record.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now, blockedUntil: 0 });
    return;
  }

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_MS;
  }
}

/** Clear attempts after a successful login. */
export function clearFailures(key: string): void {
  attempts.delete(key);
}

/** Test helper: reset all in-memory state. */
export function resetRateLimits(): void {
  attempts.clear();
}

/**
 * Best-effort client identifier for rate limiting.
 *
 * `x-forwarded-for` is appended to by proxies, so the first entry is the
 * client. It can be spoofed by a direct caller, which is why it is used only
 * for rate limiting and never for authorisation.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}
