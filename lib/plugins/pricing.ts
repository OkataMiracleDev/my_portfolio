export interface PriceablePlugin {
  priceAmount: number;
  pwywEnabled: boolean;
}

export type AmountValidation = { ok: true } | { ok: false; error: string };

export function validateAmount(
  plugin: PriceablePlugin,
  amount: number
): AmountValidation {
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    return { ok: false, error: "amount must be a whole number" };
  }
  if (amount < 0) {
    return { ok: false, error: "amount cannot be negative" };
  }
  if (!plugin.pwywEnabled && amount !== plugin.priceAmount) {
    return { ok: false, error: `amount must equal ${plugin.priceAmount}` };
  }
  return { ok: true };
}

/**
 * Whether an order is free and must therefore bypass Paystack entirely.
 *
 * Paystack rejects a zero-amount transaction outright with "Invalid Amount
 * Sent", so a pay-what-you-want plugin taken at ₦0 -- which the buy form
 * openly advertises with a "Get it free" button -- died at checkout. A free
 * order has nothing to charge, so it is fulfilled directly instead.
 *
 * This covers both routes to ₦0: a pwyw plugin the buyer priced at nothing,
 * and a plugin whose list price is ₦0 with pwyw off.
 */
export function isFreeOrder(amount: number): boolean {
  return amount === 0;
}
