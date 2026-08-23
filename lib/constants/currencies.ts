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
