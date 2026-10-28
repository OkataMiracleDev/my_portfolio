import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "saas-ad",
  briefLabel: "SaaS ad brief",
  legacyNameKey: "productName",
});
