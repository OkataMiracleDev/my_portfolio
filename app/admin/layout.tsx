import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // bg-stage, not bg-base: the sidebar and every panel are bg-frame, so the
    // page needs to sit a step darker than they do or the surfaces disappear
    // into their own background.
    <div className="flex min-h-screen flex-col bg-stage font-[family-name:var(--font-general-sans)] text-ink md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
