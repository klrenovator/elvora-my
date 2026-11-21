import { logout } from "@/app/admin/actions";

/**
 * Sign-out endpoint. Exists as a route so a plain link can end the session;
 * the action itself clears the cookie and redirects to the login screen.
 */
export async function GET() {
  await logout();
}
