"use server";

import { redirect } from "next/navigation";
import {
  createCredential,
  updateCredential,
  deleteCredential,
  reorderCredentials,
  type CredentialInput,
} from "@/lib/actions/animate-credentials";

function parseForm(formData: FormData): CredentialInput {
  return {
    label: String(formData.get("label") ?? ""),
    value: String(formData.get("value") ?? ""),
  };
}

export async function createCredentialAction(formData: FormData) {
  await createCredential(parseForm(formData));
  redirect("/admin/credentials");
}

export async function updateCredentialAction(id: string, formData: FormData) {
  await updateCredential(id, parseForm(formData));
  redirect("/admin/credentials");
}

export async function deleteCredentialAction(id: string) {
  await deleteCredential(id);
}

export async function reorderCredentialsAction(orderedIds: string[]) {
  await reorderCredentials(orderedIds);
}
