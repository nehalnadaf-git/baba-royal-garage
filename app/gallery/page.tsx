import type { Metadata } from "next";
import GalleryPageClient from "@/components/gallery/GalleryPageClient";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Gallery | Baba Royal Garage - Royal Enfield Specialist Hubli",
  description:
    "Royal Enfield workshop gallery from Hubli showing specialist repairs, detailing, engine work, and the Baba Royal Garage team.",
  path: "/gallery",
  keywords: ["Royal Enfield gallery Hubli", "Baba Royal Garage workshop photos", "RE repair photos"],
});

export default function GalleryPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Gallery", item: "/gallery" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <GalleryPageClient />
    </>
  );
}
