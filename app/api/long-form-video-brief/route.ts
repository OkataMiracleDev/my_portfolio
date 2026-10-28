import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "long-form-video",
  briefLabel: "Long-form video brief",
  legacyNameKey: "videoTitle",
});
