import type { Metadata } from "next";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy - ${SITE_NAME}`,
  description: `${SITE_NAME} privacy policy.`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as when you contact us. We also collect
            certain information automatically, including your IP address, browser type, and usage data
            through cookies and analytics services like Google Analytics.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to improve our services, analyze usage patterns, and
            provide you with a better gaming experience. We do not sell your personal information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and
            improve your experience. You can control cookie settings through your browser preferences.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Third-Party Services</h2>
          <p>
            Some games on {SITE_NAME} may be hosted by third parties. These third parties have their
            own privacy policies governing the use of your information.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at
            privacy@{SITE_DOMAIN}.
          </p>
        </section>
      </div>
    </div>
  );
}
