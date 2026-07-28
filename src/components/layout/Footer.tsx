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
    <footer className="site-footer mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="text-xl font-black tracking-tight text-white">
              {SITE_NAME}
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
              Play free online games on {SITE_NAME}. Discover action, puzzle, driving, and arcade games with no download required.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Categories</h3>
            <ul className="space-y-2">
              {GAME_CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/search?sort=newest" className="text-sm text-slate-400 transition-colors hover:text-white">New Games</Link>
              </li>
              <li>
                <Link href="/search?sort=trending" className="text-sm text-slate-400 transition-colors hover:text-white">Trending</Link>
              </li>
              <li>
                <Link href="/series" className="text-sm text-slate-400 transition-colors hover:text-white">Game Series</Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
