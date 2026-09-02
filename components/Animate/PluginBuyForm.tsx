"use client";

import { useState } from "react";
import type { StudioPluginContent } from "@/types/content";

export default function PluginBuyForm({ plugin }: { plugin: StudioPluginContent }) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(plugin.priceAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/plugins/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId: plugin.id, email, amount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not start checkout");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Your email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
        />
      </div>

      {plugin.pwywEnabled ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">Name your price (₦, minimum ₦0)</label>
          <input
            type="number"
            min={0}
            step={1}
            required
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Math.round(Number(e.target.value))))}
            className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
          />
        </div>
      ) : (
        <p className="text-lg font-semibold text-ink">₦{plugin.priceAmount.toLocaleString()}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] disabled:opacity-60"
      >
        {loading ? "Redirecting to checkout…" : amount === 0 ? "Get it free" : "Buy"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
