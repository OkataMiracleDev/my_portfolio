import { createBriefRoute } from "@/lib/briefs/route";

export const POST = createBriefRoute({
  briefType: "product-placement",
  briefLabel: "Product placement brief",
  legacyNameKey: "productName",
});
