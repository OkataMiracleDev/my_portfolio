"use client";

import { useActionState } from "react";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta } from "@/components/Shared/brand/Hud";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stage px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <OkataRing className="h-8 w-8 shrink-0" />
          <span className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold leading-none tracking-tight text-ink">
            Okata<span className="text-accent-build">admin</span>
          </span>
        </div>

        <form
          action={formAction}
          className="rounded-2xl border border-ink/10 bg-frame p-7"
        >
          <label
            htmlFor="password"
            className="mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-ink/12 bg-stage px-4 py-2.5 text-ink transition-colors duration-200 ease-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-build"
          />

          {state.error && (
            // role=alert so the failure is announced, not just painted. The
            // previous version was a plain <p> a screen reader never mentioned.
            <p role="alert" className="mt-3 text-sm text-signal">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 w-full rounded-pill bg-accent-build px-6 py-2.5 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <Meta className="mt-6 block text-center text-ink/20">
          Locked after repeated failures
        </Meta>
      </div>
    </div>
  );
}
