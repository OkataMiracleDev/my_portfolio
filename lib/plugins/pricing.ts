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
