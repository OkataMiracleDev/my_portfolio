import { routeChoices } from "@/data/landing";
import RouteChoiceCard from "./RouteChoiceCard";

export default function RouteChoiceSection() {
  return (
    <section className="px-6 pb-16 md:px-12 md:pb-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {routeChoices.map((choice) => (
          <RouteChoiceCard key={choice.id} choice={choice} />
        ))}
      </div>
    </section>
  );
}
