import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service - ${SITE_NAME}`,
  description: `${SITE_NAME} terms of service.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-black mb-6">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using {SITE_NAME}, you agree to be bound by these Terms of Service.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Use of Service</h2>
          <p>
            You agree to use {SITE_NAME} for lawful purposes only. You may not use the platform
            for any illegal or unauthorized purpose.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Intellectual Property</h2>
          <p>
            Games hosted on {SITE_NAME} are the property of their respective developers and publishers.
            {SITE_NAME} does not claim ownership of any game content.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Limitation of Liability</h2>
          <p>
            {SITE_NAME} is provided &quot;as is&quot; without any warranty. We are not liable for any
            damages arising from your use of the platform.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Changes</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
        </section>
      </div>
    </div>
  );
}
