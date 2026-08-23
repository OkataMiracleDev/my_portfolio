export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD — $" },
  { code: "EUR", symbol: "€", label: "EUR — €" },
  { code: "GBP", symbol: "£", label: "GBP — £" },
  { code: "NGN", symbol: "₦", label: "NGN — ₦" },
  { code: "CAD", symbol: "C$", label: "CAD — C$" },
  { code: "AUD", symbol: "A$", label: "AUD — A$" },
  { code: "GHS", symbol: "₵", label: "GHS — ₵" },
  { code: "KES", symbol: "KSh", label: "KES — KSh" },
  { code: "ZAR", symbol: "R", label: "ZAR — R" },
  { code: "INR", symbol: "₹", label: "INR — ₹" },
] as const;

export function currencyBadgeLabel(code: string) {
  const match = CURRENCIES.find((c) => c.code === code);
  return match ? `Prices in ${match.code} (${match.symbol})` : `Prices in ${code}`;
}

// Prefixes the currency symbol onto a price so it sits on the left of the
// value (e.g. "60,000-100,000" -> "₦60,000-100,000"). Skips prices that
// already start with a symbol/letter (e.g. "$300 – $800") to avoid doubling up.
export function prefixCurrency(price: string, code: string) {
  const trimmed = price.trim();
  if (!trimmed || /^[^0-9-]/.test(trimmed)) return trimmed;
  const symbol = CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
  return `${symbol}${symbol.length > 1 ? " " : ""}${trimmed}`;
}
