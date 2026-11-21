/**
 * Admin authentication tests.
 *
 * Run with: npm test
 *
 * Authentication is the highest-risk code in the project — it protects the
 * entire catalogue — so the negative cases matter more than the happy path.
 */
import {
  adminConfigState,
  checkRateLimit,
  clearFailures,
  createSessionToken,
  hashPassword,
  recordFailure,
  resetRateLimits,
  verifyPassword,
  verifySessionToken,
} from "@/lib/admin/auth";

let pass = 0;
let fail = 0;
const check = (name: string, cond: boolean, extra = "") => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
};

const TEST_SECRET = "x".repeat(48);

function withEnv(hash: string | undefined, secret: string | undefined, fn: () => void) {
  const previousHash = process.env.ADMIN_PASSWORD_HASH;
  const previousSecret = process.env.ADMIN_SESSION_SECRET;
  if (hash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
  else process.env.ADMIN_PASSWORD_HASH = hash;
  if (secret === undefined) delete process.env.ADMIN_SESSION_SECRET;
  else process.env.ADMIN_SESSION_SECRET = secret;
  try {
    fn();
  } finally {
    if (previousHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
    else process.env.ADMIN_PASSWORD_HASH = previousHash;
    if (previousSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = previousSecret;
  }
}

/* ------------------------------- Hashing --------------------------------- */

const stored = hashPassword("correct horse battery staple");

check("hash uses scrypt format", stored.startsWith("scrypt$"));
check("hash has three parts", stored.split("$").length === 3);
check("hash does not contain the password", !stored.includes("correct horse"));
check("correct password verifies", verifyPassword("correct horse battery staple", stored));
check("wrong password rejected", !verifyPassword("wrong password", stored));
check("empty password rejected", !verifyPassword("", stored));
check("password is case sensitive", !verifyPassword("Correct horse battery staple", stored));

const storedAgain = hashPassword("correct horse battery staple");
check("same password produces a different hash (unique salt)", stored !== storedAgain);
check("both hashes still verify", verifyPassword("correct horse battery staple", storedAgain));

check("malformed hash rejected", !verifyPassword("anything", "not-a-hash"));
check("wrong algorithm rejected", !verifyPassword("anything", "bcrypt$aa$bb"));
check("truncated hash rejected", !verifyPassword("anything", `scrypt$aa$bb`));

/* ------------------------------- Sessions -------------------------------- */

withEnv("scrypt$a$b", TEST_SECRET, () => {
  const token = createSessionToken();
  check("token created when configured", typeof token === "string" && token.includes("."));
  check("fresh token verifies", verifySessionToken(token ?? ""));

  const parts = (token ?? "").split(".");
  const tamperedExp = `${Buffer.from(JSON.stringify({ exp: 9999999999 })).toString("base64url")}.${parts[1]}`;
  check("tampered payload rejected", !verifySessionToken(tamperedExp));
  check("tampered signature rejected", !verifySessionToken(`${parts[0]}.AAAAAAAA`));
  check("empty token rejected", !verifySessionToken(""));
  check("undefined token rejected", !verifySessionToken(undefined));
  check("garbage token rejected", !verifySessionToken("not.a.token"));

  // Expiry: a token minted 9 hours ago must be dead (TTL is 8 hours).
  const old = createSessionToken(Date.now() - 9 * 60 * 60 * 1000);
  check("expired token rejected", !verifySessionToken(old ?? ""));
  check("tampered expiry cannot be extended", !verifySessionToken(tamperedExp));
});

withEnv("scrypt$a$b", undefined, () => {
  check("no secret means no token", createSessionToken() === null);
  check("no secret means nothing verifies", !verifySessionToken("a.b"));
});

withEnv("scrypt$a$b", "too-short", () => {
  check("short secret rejected as configuration", createSessionToken() === null);
});

// A token signed with one secret must not verify under another.
withEnv("scrypt$a$b", TEST_SECRET, () => {
  const token = createSessionToken() ?? "";
  withEnv("scrypt$a$b", "y".repeat(48), () => {
    check("token does not verify under a rotated secret", !verifySessionToken(token));
  });
});

/* ------------------------------ Configuration ---------------------------- */

withEnv(undefined, undefined, () => {
  const state = adminConfigState();
  check("unconfigured state reports not ready", state.ready === false);
  check("missing list names the hash", state.missing.some((m) => m.includes("ADMIN_PASSWORD_HASH")));
  check("missing list names the secret", state.missing.some((m) => m.includes("ADMIN_SESSION_SECRET")));
});

withEnv(stored, TEST_SECRET, () => {
  check("fully configured state is ready", adminConfigState().ready === true);
});

withEnv("garbage-hash", TEST_SECRET, () => {
  check("malformed hash reported as not ready", adminConfigState().ready === false);
});

/* ------------------------------- Rate limit ------------------------------ */

resetRateLimits();
const now = 1_000_000;

for (let i = 0; i < 5; i++) {
  check(`attempt ${i + 1} allowed`, checkRateLimit("ip-1", now).allowed);
  recordFailure("ip-1", now);
}
const blocked = checkRateLimit("ip-1", now);
check("blocked after five failures", blocked.allowed === false);
check("retryAfter is positive", blocked.retryAfter > 0);
check("other keys unaffected", checkRateLimit("ip-2", now).allowed);

// Block expires.
check("block lifts after the window", checkRateLimit("ip-1", now + 16 * 60 * 1000).allowed);

// Successful login clears the counter.
resetRateLimits();
recordFailure("ip-3", now);
recordFailure("ip-3", now);
clearFailures("ip-3");
check("cleared failures restore full allowance", checkRateLimit("ip-3", now).remaining === 5);

resetRateLimits();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
