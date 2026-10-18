import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const url = site.seo.siteUrl;
  return {
    rules: site.previewMode ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    ...(url ? { sitemap: `${url}/sitemap.xml` } : {}),
  };
}
