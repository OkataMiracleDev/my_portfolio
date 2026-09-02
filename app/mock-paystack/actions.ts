"use server";

// Mock Paystack form action — receives the cancel/pay decision from the
// checkout page, flips the payment row's status, and redirects back to
// /brandmydell/ with a query string the page reads on boot.

import { redirect } from "next/navigation";
import { setPaymentStatus } from "@/lib/brandmydell/repo";

export async function completeMockPaystack(formData: FormData): Promise<void> {
  const reference = String(formData.get("reference") || "").trim();
  const decision = String(formData.get("decision") || "").trim();
  if (!reference || (decision !== "pay" && decision !== "cancel")) {
    // Bad input — bounce back to the brandmydell root with an error param
    // the page can surface as a toast.
    redirect(`/brandmydell/?error=bad_checkout`);
  }

  const next = decision === "pay" ? "paid" : "cancelled";
  await setPaymentStatus(reference, next);

  const param = next === "paid" ? "paid" : "cancelled";
  redirect(`/brandmydell/?${param}=${encodeURIComponent(reference)}`);
}
