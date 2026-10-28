import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "event-trailer",
  briefLabel: "Event trailer brief",
  legacyNameKey: "eventName",
});
