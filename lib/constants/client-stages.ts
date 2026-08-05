// Split out of lib/actions/clients.ts — a "use server" file may only export
// async functions, so this plain runtime constant (needed by client
// components too) can't live there.
export const CLIENT_STAGES = [
  "lead",
  "conversation",
  "meeting",
  "proposal_sent",
  "deposit_paid",
  "in_progress",
  "completed",
  "lost",
] as const;
