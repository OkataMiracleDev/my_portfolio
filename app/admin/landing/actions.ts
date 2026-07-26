"use server";

import { redirect } from "next/navigation";
import {
  createFunFact,
  updateFunFact,
  deleteFunFact,
  reorderFunFacts,
  type FunFactInput,
} from "@/lib/actions/fun-facts";

function parseForm(formData: FormData): FunFactInput {
  return {
    label: String(formData.get("label") ?? ""),
    value: String(formData.get("value") ?? ""),
  };
}

export async function createFunFactAction(formData: FormData) {
  await createFunFact(parseForm(formData));
  redirect("/admin/landing");
}

export async function updateFunFactAction(id: string, formData: FormData) {
  await updateFunFact(id, parseForm(formData));
  redirect("/admin/landing");
}

export async function deleteFunFactAction(id: string) {
  await deleteFunFact(id);
}

export async function reorderFunFactsAction(orderedIds: string[]) {
  await reorderFunFacts(orderedIds);
}
