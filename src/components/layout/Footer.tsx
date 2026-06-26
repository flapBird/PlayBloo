import Link from "next/link";
import { SITE_NAME, GAME_CATEGORIES } from "@/lib/constants";

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="text-xl font-black tracking-tight text-foreground">
              {SITE_NAME}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Play free online games on {SITE_NAME}. Discover thousands of exciting games including action, puzzle, driving, and more. No download required.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-2">
              {GAME_CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/search?sort=newest" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Games</Link>
              </li>
              <li>
                <Link href="/search?sort=trending" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trending</Link>
              </li>
              <li>
                <Link href="/series" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Game Series</Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
