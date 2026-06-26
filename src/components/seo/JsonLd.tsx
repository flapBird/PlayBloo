import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface JsonLdProps {
  type?: "WebSite" | "BreadcrumbList" | "Game" | "Series" | "CollectionPage";
  data?: Record<string, unknown>;
}

export function JsonLd({ type = "WebSite", data = {} }: JsonLdProps) {
  let schema: Record<string, unknown>;

  switch (type) {
    case "WebSite":
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: "Play free online games on PlayBloo.org.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        ...data,
      };
      break;

    case "BreadcrumbList":
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.itemListElement || [],
        ...data,
      };
      break;

    case "Game":
      schema = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        ...data,
      };
      break;

    case "Series":
      schema = {
        "@context": "https://schema.org",
        "@type": "CreativeWorkSeries",
        ...data,
      };
      break;

    case "CollectionPage":
      schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        ...data,
      };
      break;

    default:
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        ...data,
      };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function GameJsonLd({
  name,
  description,
  url,
  image,
  author,
  playMode = "SinglePlayer",
  operatingSystem = "Any",
  applicationCategory = "GameApplication",
}: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  author?: string | null;
  playMode?: string;
  operatingSystem?: string;
  applicationCategory?: string;
}) {
  return (
    <JsonLd
      type="Game"
      data={{
        name,
        description,
        url,
        ...(image ? { image } : {}),
        ...(author ? { author: { "@type": "Person", name: author } } : {}),
        playMode,
        operatingSystem,
        applicationCategory,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
