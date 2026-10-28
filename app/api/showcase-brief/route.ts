import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "showcase",
  briefLabel: "Showcase brief",
  legacyNameKey: "productName",
});
