import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" prefetch={false} className="text-xl font-black tracking-tight text-foreground">
              {SITE_NAME}
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Discover browser games and explore guides to the games on your radar. Play, read and find your next adventure.
            </p>
          </div>

          {/* Discovery */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Discover</h3>
            <ul className="space-y-2">
              <li><Link href="/category" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Browse Categories</Link></li>
              <li><Link href="/gacha" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Game Gacha</Link></li>
              <li><Link href="/guides" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Game Guides</Link></li>
              <li><Link href="/favorites" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Your Favorites</Link></li>
              <li><Link href="/recently-played" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Recently Played</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
              </li>
              <li>
                <Link href="/search?sort=newest" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">New Games</Link>
              </li>
              <li>
                <Link href="/search?sort=trending" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Trending</Link>
              </li>
              <li>
                <Link href="/series" prefetch={false} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Game Series</Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
