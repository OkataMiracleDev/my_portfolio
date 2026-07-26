"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-card bg-base-raised p-8"
      >
        <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
          Admin Login
        </h1>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mb-4 w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
        />
        {state.error && (
          <p className="mb-4 text-sm text-red-600">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
