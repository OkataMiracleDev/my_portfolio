import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "youtube-intro",
  briefLabel: "YouTube intro brief",
  legacyNameKey: "channelName",
});
