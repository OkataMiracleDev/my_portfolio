import Link from "next/link";
import {
  listRetainerTiers,
  listRateServices,
  listRateAddons,
  listRateTerms,
} from "@/lib/actions/rate-page";
import {
  DEFAULT_RETAINER_TIERS,
  DEFAULT_SERVICES,
  DEFAULT_ADDONS,
  DEFAULT_TERMS,
} from "@/lib/constants/rate-card-defaults";
import RetainerTiersEditor from "@/components/Admin/RatePage/RetainerTiersEditor";
import ServicesEditor from "@/components/Admin/RatePage/ServicesEditor";
import AddonsEditor from "@/components/Admin/RatePage/AddonsEditor";
import TermsEditor from "@/components/Admin/RatePage/TermsEditor";
import { PageHeader } from "@/components/Admin/ui/Shell";
import {
  saveRetainerTiersAction,
  saveRateServicesAction,
  saveRateAddonsAction,
  saveRateTermsAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function RatesAdminPage() {
  const [tiers, services, addons, terms] = await Promise.all([
    listRetainerTiers(),
    listRateServices(),
    listRateAddons(),
    listRateTerms(),
  ]);

  // A section that has never been saved has no rows, but the public page is
  // showing the built-in defaults for it. Seeding the editor with those same
  // defaults means what is on screen here matches what is live, so the first
  // edit is a tweak rather than retyping the page from scratch.
  const tierRows = (tiers.length > 0 ? tiers : DEFAULT_RETAINER_TIERS).map((tier) => ({
    code: tier.code,
    name: tier.name,
    tagline: tier.tagline,
    monthly: String(tier.monthly),
    features: tier.features,
    featured: tier.featured,
  }));

  const serviceRows = (services.length > 0 ? services : DEFAULT_SERVICES).map((service) => ({
    timecode: service.timecode,
    title: service.title,
    description: service.description,
    price: service.price,
    unit: service.unit,
  }));

  const addonRows = (addons.length > 0 ? addons : DEFAULT_ADDONS).map((addon) => ({
    name: addon.name,
    value: addon.value,
  }));

  const termLines = terms.length > 0 ? terms.map((term) => term.body) : DEFAULT_TERMS;

  const unsaved = [
    tiers.length === 0 && "retainer tiers",
    services.length === 0 && "project work",
    addons.length === 0 && "add-ons",
    terms.length === 0 && "terms",
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-4xl">
      <PageHeader
        eyebrow="Site content"
        title="Rate card page"
        description="The public rate card at /animate/rates. Each section saves on its own and goes live immediately."
        action={
          <Link
            href="/animate/rates"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill border border-ink/15 px-5 py-2 text-sm font-medium text-ink/70 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
          >
            View live page &#8599;
          </Link>
        }
      />

      {unsaved.length > 0 && (
        <p className="mb-6 rounded-xl border border-ink/15 bg-frame px-4 py-3 text-sm text-ink/65">
          Never edited here: <span className="text-ink">{unsaved.join(", ")}</span>. Those sections
          are showing the values the page originally shipped with — they are filled in below, so
          saving keeps them exactly as they are now.
        </p>
      )}

      <div className="space-y-6">
        <RetainerTiersEditor initialTiers={tierRows} action={saveRetainerTiersAction} />
        <ServicesEditor initialServices={serviceRows} action={saveRateServicesAction} />
        <AddonsEditor initialAddons={addonRows} action={saveRateAddonsAction} />
        <TermsEditor initialTerms={termLines} action={saveRateTermsAction} />
      </div>
    </div>
  );
}
