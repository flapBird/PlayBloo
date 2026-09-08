import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "./globals.css";

const isProduction = process.env.NODE_ENV === "production";
const productionHostname = new URL(SITE_URL).hostname;

export const metadata: Metadata = {
  other: {
    "google-adsense-account": "ca-pub-4183802444188513",
  },
  title: {
    default: `${SITE_NAME} - Free Online Games`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(`${SITE_URL}/`),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Free Online Games`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Free Online Games`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="site-background" aria-hidden="true" />
        <Header />
        <main className="site-main flex-1">{children}</main>
        <Footer />
        <JsonLd type="WebSite" />
        {isProduction && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              if (window.location.hostname === ${JSON.stringify(productionHostname)}) {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-WVF4JL80YN');

                var script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-WVF4JL80YN';
                document.head.appendChild(script);
              }
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
