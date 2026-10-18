import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = site.seo.siteUrl;
  return url ? [{ url, changeFrequency: "monthly", priority: 1 }] : [];
}
