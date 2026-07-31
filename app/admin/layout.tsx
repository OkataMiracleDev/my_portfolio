import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-base text-ink md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
    </div>
  );
}
