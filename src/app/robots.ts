import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal search results (Google recommends not crawling them) and the
      // list/grid view toggle carry no unique indexable content and each hit
      // is a full dynamic render. ?sort= / ?page= variants stay crawlable.
      disallow: ["/admin/", "/search?q=", "/search?*view="],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
