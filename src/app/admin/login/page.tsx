"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

/**
 * Owner sign-in.
 *
 * No "forgot password" link, because there is no email channel to reset
 * through: the password hash is replaced by the operator running
 * `npm run admin:hash`. Saying that plainly is more useful than a dead link.
 */
export default function AdminLoginPage() {
  const initialState: LoginState = {};
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="tracking-eyebrow text-[color:var(--color-tan)]">Elvora</p>
      <h1 className="font-display mt-3 text-[2rem] leading-tight text-[color:var(--color-ink-strong)]">
        Admin sign-in
      </h1>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-muted)]">
        This area manages the product catalogue. It is not part of the public
        storefront.
      </p>

      <form action={formAction} className="mt-8">
        <label
          htmlFor="password"
          className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full border border-[color:var(--color-line-strong)] bg-white px-3 py-2.5 text-[0.9375rem]"
        />

        {state.error ? (
          <p role="alert" className="mt-3 border-l-2 border-[#a8442c] bg-white px-3 py-2 text-[0.8125rem] leading-relaxed text-[#a8442c]">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 flex h-11 w-full items-center justify-center bg-[color:var(--color-espresso)] px-6 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
        Forgot the password? Replace it by generating a new hash with{" "}
        <code className="rounded bg-white px-1 py-0.5">npm run admin:hash</code> and
        updating the <code className="rounded bg-white px-1 py-0.5">ADMIN_PASSWORD_HASH</code>{" "}
        environment variable.
      </p>
    </main>
  );
}
