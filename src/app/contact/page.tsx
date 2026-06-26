import type { Metadata } from "next";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact - ${SITE_NAME}`,
  description: `Contact ${SITE_NAME}.`,
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
            <p className="text-sm">hello@{SITE_DOMAIN}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">Game Submissions</h2>
            <p className="text-sm">developers@{SITE_DOMAIN}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">DMCA / Copyright</h2>
            <p className="text-sm">dmca@{SITE_DOMAIN}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground mb-1">Privacy</h2>
            <p className="text-sm">privacy@{SITE_DOMAIN}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
