import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import FunStuffGrid from "./FunStuffGrid";
import RouteChoiceSection from "./RouteChoiceSection";
import LandingFooter from "./LandingFooter";
import { funFactCards } from "@/data/landing";

export default function Landing() {
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
