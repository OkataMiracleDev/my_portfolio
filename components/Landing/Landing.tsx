import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import FunStuffGrid from "./FunStuffGrid";
import RouteChoiceSection from "./RouteChoiceSection";
import LandingFooter from "./LandingFooter";
import type { funFactCards } from "@/lib/db/schema";

type FunFactCard = typeof funFactCards.$inferSelect;

export default function Landing({ funFactCards }: { funFactCards: FunFactCard[] }) {
  return (
    <div className="min-h-screen bg-base">
      <LandingHeader />
      <LandingHero />
      <FunStuffGrid facts={funFactCards} />
      <RouteChoiceSection />
      <LandingFooter />
    </div>
  );
}
