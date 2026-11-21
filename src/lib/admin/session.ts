import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  verifySessionToken,
} from "@/lib/admin/auth";

/**
 * Server-side session helpers.
 *
 * `isOwner()` is the single authorisation check used by every admin page and
 * server action. Keeping it in one place means there is one thing to audit.
 */
export async function isOwner(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Throwing variant for use inside server actions. */
export async function requireOwner(): Promise<void> {
  if (!(await isOwner())) {
    throw new Error("Not authorised. Sign in to the admin area first.");
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Secure is required in production; relaxed locally so the admin works
    // over http during development without silently disabling the flag.
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
