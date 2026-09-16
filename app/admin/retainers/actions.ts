"use server";

import { redirect } from "next/navigation";
import {
  createRetainer,
  updateRetainer,
  deleteRetainer,
  rotateRetainerShareToken,
  createRetainerProject,
  updateRetainerProject,
  updateRetainerProjectPhase,
  deleteRetainerProject,
  reorderRetainerProjects,
  createRetainerUpdate,
  deleteRetainerUpdate,
  type RetainerInput,
  type RetainerProjectInput,
  type RetainerUpdateInput,
} from "@/lib/actions/retainers";
import { RETAINER_PHASES, type RetainerPhase } from "@/lib/constants/retainer-phases";
import { RETAINER_STATUSES, type RetainerStatus } from "@/lib/constants/retainer-phases";

function parseRetainer(formData: FormData): RetainerInput {
  const status = String(formData.get("status") ?? "active");
  return {
    name: String(formData.get("name") ?? ""),
    email: (formData.get("email") as string) || null,
    company: (formData.get("company") as string) || null,
    status: (RETAINER_STATUSES as readonly string[]).includes(status)
      ? (status as RetainerStatus)
      : "active",
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createRetainerAction(formData: FormData) {
  const row = await createRetainer(parseRetainer(formData));
  redirect(`/admin/retainers/${row.id}`);
}

export async function updateRetainerAction(id: string, formData: FormData) {
  await updateRetainer(id, parseRetainer(formData));
  redirect(`/admin/retainers/${id}`);
}

export async function deleteRetainerAction(id: string) {
  await deleteRetainer(id);
}

export async function rotateRetainerShareTokenAction(id: string) {
  return rotateRetainerShareToken(id);
}

// --- Projects ------------------------------------------------------------

function parseProject(formData: FormData): RetainerProjectInput {
  const phase = String(formData.get("phase") ?? "scripting");
  return {
    retainerClientId: String(formData.get("retainerClientId") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: (formData.get("description") as string) || null,
    phase: (RETAINER_PHASES as readonly string[]).includes(phase)
      ? (phase as RetainerPhase)
      : "scripting",
  };
}

export async function createRetainerProjectAction(formData: FormData) {
  const row = await createRetainerProject(parseProject(formData));
  redirect(`/admin/retainers/${row.retainerClientId}/projects/${row.id}`);
}

export async function updateRetainerProjectAction(id: string, formData: FormData) {
  const row = await updateRetainerProject(id, parseProject(formData));
  redirect(`/admin/retainers/${row.retainerClientId}/projects/${id}`);
}

export async function updateRetainerProjectPhaseAction(id: string, phase: string) {
  if (!(RETAINER_PHASES as readonly string[]).includes(phase)) return;
  await updateRetainerProjectPhase(id, phase as RetainerPhase);
}

export async function deleteRetainerProjectAction(id: string) {
  await deleteRetainerProject(id);
}

export async function reorderRetainerProjectsAction(orderedIds: string[]) {
  await reorderRetainerProjects(orderedIds);
}

// --- Updates -------------------------------------------------------------

function parseUpdate(formData: FormData): RetainerUpdateInput {
  const phase = String(formData.get("phase") ?? "scripting");
  return {
    retainerProjectId: String(formData.get("retainerProjectId") ?? ""),
    phase: (RETAINER_PHASES as readonly string[]).includes(phase)
      ? (phase as RetainerPhase)
      : "scripting",
    title: String(formData.get("title") ?? ""),
    body: (formData.get("body") as string) || null,
    images: formData.getAll("images").map(String).filter(Boolean),
    videoEmbedUrl: (formData.get("videoEmbedUrl") as string) || null,
  };
}

export async function createRetainerUpdateAction(formData: FormData) {
  return createRetainerUpdate(parseUpdate(formData));
}

export async function deleteRetainerUpdateAction(id: string, retainerProjectId: string) {
  await deleteRetainerUpdate(id, retainerProjectId);
}
