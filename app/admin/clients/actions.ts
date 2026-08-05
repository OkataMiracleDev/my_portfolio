"use server";

import { redirect } from "next/navigation";
import {
  createClient,
  updateClient,
  deleteClient,
  updateClientStage,
  rotateShareToken,
  createClientUpdate,
  deleteClientUpdate,
  CLIENT_STAGES,
  type ClientInput,
} from "@/lib/actions/clients";

function parseClientForm(formData: FormData): ClientInput {
  const stage = String(formData.get("stage") ?? "lead");
  return {
    name: String(formData.get("name") ?? ""),
    email: (formData.get("email") as string) || null,
    company: (formData.get("company") as string) || null,
    stage: CLIENT_STAGES.includes(stage as (typeof CLIENT_STAGES)[number])
      ? (stage as (typeof CLIENT_STAGES)[number])
      : "lead",
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createClientAction(formData: FormData) {
  const client = await createClient(parseClientForm(formData));
  redirect(`/admin/clients/${client.id}`);
}

export async function updateClientAction(id: string, formData: FormData) {
  await updateClient(id, parseClientForm(formData));
  redirect(`/admin/clients/${id}`);
}

export async function deleteClientAction(id: string) {
  await deleteClient(id);
  redirect("/admin/clients");
}

export async function updateClientStageAction(id: string, stage: string) {
  if (!CLIENT_STAGES.includes(stage as (typeof CLIENT_STAGES)[number])) return;
  await updateClientStage(id, stage as (typeof CLIENT_STAGES)[number]);
}

export async function rotateShareTokenAction(id: string) {
  return rotateShareToken(id);
}

export async function createClientUpdateAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  return createClientUpdate({
    clientId,
    title: String(formData.get("title") ?? ""),
    body: (formData.get("body") as string) || null,
    images: formData.getAll("images").map(String).filter(Boolean),
    videoEmbedUrl: (formData.get("videoEmbedUrl") as string) || null,
  });
}

export async function deleteClientUpdateAction(id: string, clientId: string) {
  await deleteClientUpdate(id, clientId);
}
