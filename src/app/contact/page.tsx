import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact - ${SITE_NAME}`,
  description: `Contact ${SITE_NAME}.`,
   alternates: {
     canonical: "/contact",
   },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-black mb-6">Contact Us</h1>
      <div className="space-y-6 text-muted-foreground">
        <p className="text-sm leading-relaxed">
          Have a question, suggestion, or want to report an issue? We would love to hear from you.
        </p>
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">General Inquiries</h2>
            <a href={`mailto:contact@${SITE_DOMAIN}`} className="inline-flex min-h-9 items-center text-sm text-primary underline underline-offset-4">contact@{SITE_DOMAIN}</a>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">Game Submissions</h2>
            <Link href="/submit-game" className="block py-2 text-sm font-bold text-primary underline underline-offset-4">Submit a game for review</Link>
            <a href={`mailto:developers@${SITE_DOMAIN}`} className="inline-flex min-h-9 items-center text-sm text-primary underline underline-offset-4">developers@{SITE_DOMAIN}</a>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">DMCA / Copyright</h2>
            <a href={`mailto:dmca@${SITE_DOMAIN}`} className="inline-flex min-h-9 items-center text-sm text-primary underline underline-offset-4">dmca@{SITE_DOMAIN}</a>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">Privacy</h2>
            <a href={`mailto:privacy@${SITE_DOMAIN}`} className="inline-flex min-h-9 items-center text-sm text-primary underline underline-offset-4">privacy@{SITE_DOMAIN}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
