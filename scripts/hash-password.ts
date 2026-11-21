/**
 * Generate an admin password hash.
 *
 * Usage:
 *   npm run admin:hash -- "your new password"
 *
 * Prints the value to paste into ADMIN_PASSWORD_HASH. Only the hash is written
 * to the environment — the password itself is never stored anywhere.
 */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run admin:hash -- \"your new password\"");
  process.exit(1);
}

if (password.length < 12) {
  console.error("Use at least 12 characters. This password controls the whole catalogue.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = scryptSync(password, salt, 64).toString("hex");

console.log("\nAdd these to your environment (e.g. Vercel project settings):\n");
console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt}$${derived}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log("\nKeep both values secret. Changing the session secret signs everyone out.");
