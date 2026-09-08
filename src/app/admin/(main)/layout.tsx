import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { SITE_NAME } from "@/lib/constants";
import {
  LayoutDashboard, Gamepad2, Tags, ListTree, FolderTree, Search,
  FileSpreadsheet, ExternalLink, Inbox
} from "lucide-react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Games", href: "/admin/games", icon: Gamepad2 },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Tags", href: "/admin/tags", icon: Tags },
  { label: "Series", href: "/admin/series", icon: ListTree },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Import CSV", href: "/admin/import", icon: FileSpreadsheet },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-black text-lg tracking-tight">{SITE_NAME} Admin</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{admin.email}</span>
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <nav className="space-y-1 sticky top-20">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
