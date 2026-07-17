"use client";
import { useState } from "react";
import Link from "next/link";
import type { ResourceContent } from "@/types/content";

type FilterValue = "all" | ResourceContent["type"];

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "download", label: "Downloads" },
  { value: "tutorial", label: "Tutorials" },
  { value: "tool-link", label: "Tool links" },
];

export default function ResourceFilter({ resources }: { resources: ResourceContent[] }) {
  const [active, setActive] = useState<FilterValue>("all");
  const visible = active === "all" ? resources : resources.filter((r) => r.type === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActive(filter.value)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out ${
              active === filter.value ? "bg-accent-animate text-ink" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visible.map((resource) => (
          <li key={resource.id}>
            <Link
              href={`/animate/resources/${resource.slug}`}
              className="block h-full rounded-card bg-base-raised p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              <p className="text-sm font-medium text-accent-animate">{resource.type}</p>
              <p className="mt-2 font-semibold text-ink">{resource.title}</p>
              <p className="mt-2 text-sm text-ink/70">{resource.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
