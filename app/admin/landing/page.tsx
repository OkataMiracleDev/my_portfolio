import { listFunFacts } from "@/lib/actions/fun-facts";
import { deleteFunFactAction, reorderFunFactsAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function FunFactsAdminPage() {
  const items = await listFunFacts();

  return (
    <div>
      <PageHeader
        eyebrow="Site content"
        title="Fun facts"
        description="The small what-I-am-up-to cards on the landing page."
        action={<NewButton href="/admin/landing/new">New fun fact</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No fun facts yet"
          description="Three or four keeps the landing page a teaser rather than a biography."
          action={<NewButton href="/admin/landing/new">New fun fact</NewButton>}
        />
      ) : (
        <SortableList
          label="fun fact"
          deleteAction={deleteFunFactAction}
          reorderAction={reorderFunFactsAction}
          rows={items.map((item) => ({
            id: item.id,
            title: item.label,
            meta: item.value,
            editHref: `/admin/landing/${item.id}`,
          }))}
        />
      )}
    </div>
  );
}
