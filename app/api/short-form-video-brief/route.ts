import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "short-form-video",
  briefLabel: "Short-form video brief",
  legacyNameKey: "brandName",
});
