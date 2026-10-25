import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryNav } from "@/lib/category-nav";
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
    icon: [
      { url: "/favicon.ico?v=ribbon-1", sizes: "16x16 32x32 48x48 256x256" },
      { url: "/favicon.png?v=ribbon-1", sizes: "48x48", type: "image/png" },
      { url: "/icon.png?v=ribbon-1", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png?v=ribbon-1", sizes: "180x180", type: "image/png" },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Shared, cached category navigation feeds the sidebar, the mobile menu
  // and the footer links from one read.
  const categories = await getCategoryNav();

  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { document.documentElement.classList.toggle("dark", localStorage.getItem("playbloo-theme") !== "light"); } catch {}` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="site-background" aria-hidden="true" />
        <Header categories={categories} />
        <CategorySidebar categories={categories}>
          <main className="site-main flex-1">{children}</main>
          <Footer />
        </CategorySidebar>
        <JsonLd type="WebSite" />
        {isProduction && (
          <Script id="microsoft-clarity" strategy="lazyOnload">
            {`
              if (window.location.hostname === ${JSON.stringify(productionHostname)}) {
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "yoqf7svorh");
              }
            `}
          </Script>
        )}
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
