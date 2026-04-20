import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { services } from "@/lib/services";
import { reModels } from "@/lib/models";
import { locations } from "@/lib/locations";
import { blogPosts } from "@/lib/blogs";

const staticRoutes = [
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/faq",
  "/reviews",
  "/gallery",
  "/emergency-royal-enfield-repair-hubli",
  "/privacy-policy",
  "/terms-of-service",
] as const;

function absolute(path: string) {
  return `${business.url}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absolute(route),
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services
    .filter(Boolean)
    .map((service) => ({
      url: absolute(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  const modelEntries: MetadataRoute.Sitemap = reModels.map((model) => ({
    url: absolute(`/${model.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((location) => ({
    url: absolute(`/${location.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absolute(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...modelEntries,
    ...locationEntries,
    ...blogEntries,
  ];
}
