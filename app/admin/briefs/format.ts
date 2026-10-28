/**
 * Rendered on the server, which runs in UTC on Vercel -- so the zone is named
 * explicitly, or every brief would read an hour off from when it arrived.
 */
export function formatReceived(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
