"use server";

import { redirect } from "next/navigation";
import {
  createRateCard,
  updateRateCard,
  deleteRateCard,
  type RateCardInput,
} from "@/lib/actions/rate-cards";

function parseForm(formData: FormData): RateCardInput {
  const sections = formData.getAll("lineItemSection").map(String);
  const titles = formData.getAll("lineItemTitle").map(String);
  const descriptions = formData.getAll("lineItemDescription").map(String);
  const prices = formData.getAll("lineItemPrice").map(String);
  const units = formData.getAll("lineItemUnit").map(String);

  const lineItems = titles
    .map((title, i) => ({
      section: sections[i] ?? "",
      title,
      description: descriptions[i] ?? "",
      price: prices[i] ?? "",
      unit: units[i] ?? "",
    }))
    .filter((item) => item.title.trim() && item.price.trim());

  const clientId = String(formData.get("clientId") ?? "");
  const terms = String(formData.get("terms") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    clientId: clientId || null,
    title: String(formData.get("title") ?? ""),
    layout: formData.get("layout") === "sectioned" ? "sectioned" : "flat",
    currency: String(formData.get("currency") ?? "USD") || "USD",
    lineItems,
    terms,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createRateCardAction(formData: FormData) {
  const card = await createRateCard(parseForm(formData));
  redirect(card.clientId ? `/admin/clients/${card.clientId}` : "/admin/rate-cards");
}

export async function updateRateCardAction(id: string, formData: FormData) {
  const card = await updateRateCard(id, parseForm(formData));
  redirect(card.clientId ? `/admin/clients/${card.clientId}` : "/admin/rate-cards");
}

export async function deleteRateCardAction(id: string, clientId?: string | null) {
  await deleteRateCard(id, clientId);
}
