import { listPosts } from "@/lib/actions/posts";
import { deletePostAction } from "./actions";
import DeleteButton from "@/components/Admin/ui/DeleteButton";
import {
  PageHeader,
  NewButton,
  EmptyState,
  DataList,
  Row,
  RowLink,
  Badge,
} from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const items = await listPosts();

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Posts"
        description="Writing published at /build/blog. Drafts stay invisible to the public site."
        action={<NewButton href="/admin/posts/new">New post</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="Nothing written yet"
          description="Posts appear at /build/blog once published."
          action={<NewButton href="/admin/posts/new">New post</NewButton>}
        />
      ) : (
        <DataList>
          {items.map((item) => (
            <Row
              key={item.id}
              title={item.title}
              meta={item.slug}
              badge={
                item.published ? (
                  <Badge tone="live">Published</Badge>
                ) : (
                  <Badge tone="muted">Draft</Badge>
                )
              }
              actions={
                <>
                  {item.published && (
                    <RowLink href={`/build/blog/${item.slug}`} external>
                      View
                    </RowLink>
                  )}
                  <RowLink href={`/admin/posts/${item.id}`}>Edit</RowLink>
                  <DeleteButton action={deletePostAction.bind(null, item.id)} label="post" />
                </>
              }
            />
          ))}
        </DataList>
      )}
    </div>
  );
}
