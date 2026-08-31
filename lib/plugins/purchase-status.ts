export type PurchaseStatus = "pending" | "paid" | "cancelled";

// Only a pending purchase may transition to paid. This is the single
// source of truth that makes lib/plugins/repo.ts's markPurchasePaid()
// safe to call twice for the same reference — once from the Paystack
// webhook, once from the success-page callback verify, in either order,
// any number of times.
export function canTransitionToPaid(status: PurchaseStatus): boolean {
  return status === "pending";
}
