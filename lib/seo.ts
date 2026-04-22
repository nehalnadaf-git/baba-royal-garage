import type { Metadata } from "next";
import { business } from "@/lib/business";

export const baseSEO = {
  siteName: "Baba Royal Garage",
  siteUrl: business.url,
  defaultTitle: "Baba Royal Garage | Royal Enfield Specialist Hubli",
  defaultDescription:
    "Hubli's most trusted Royal Enfield specialist. Expert servicing, engine repair, genuine parts, and doorstep pickup across Hubli.",
  defaultOGImage: "/ogimage/ogimage.png",
  locale: "en_IN",
  geo: {
    region: "IN-KA",
    placename: "Hubli",
    position: "15.3568479;75.1464629",
    icbm: "15.3568479, 75.1464629",
  },
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  images?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

type BreadcrumbItem = {
  name: string;
  item: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${business.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  images,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataOptions): Metadata {
  const openGraphImages = (images?.length ? images : [baseSEO.defaultOGImage]).map((image) => ({
    url: toAbsoluteUrl(image),
    width: 1200,
    height: 630,
    alt: title,
  }));

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: baseSEO.locale,
      url: toAbsoluteUrl(path),
      siteName: baseSEO.siteName,
      title,
      description,
      images: openGraphImages,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors?.length ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraphImages.map((image) => image.url),
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: toAbsoluteUrl(entry.item),
    })),
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHomeBusinessGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRepair",
        "@id": `${business.url}/#business`,
        name: business.name,
        description: business.fullDescription,
        url: business.url,
        telephone: business.phone1,
        image: `${business.url}/ogimage/ogimage.png`,
        priceRange: "\u20b9\u20b9",
        founder: {
          "@id": `${business.url}/#founder`,
        },
        sameAs: Object.values(business.social),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "500",
        },
        openingHoursSpecification: business.hours.days.map((day) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: `https://schema.org/${day}`,
          opens: business.hours.opens,
          closes: business.hours.closes,
        })),
        department: business.branches.map((branch) => ({
          "@type": "AutoRepair",
          "@id": `${business.url}/#branch-${branch.id}`,
          name: `${business.name} - ${branch.name}`,
          telephone: business.phone1,
          hasMap: branch.mapsUrl,
          address: {
            "@type": "PostalAddress",
            streetAddress: branch.address,
            addressLocality: branch.city,
            addressRegion: branch.state,
            postalCode: branch.pincode,
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: branch.lat,
            longitude: branch.lng,
          },
        })),
      },
      {
        "@type": "Person",
        "@id": `${business.url}/#founder`,
        name: business.owner.name,
        jobTitle: business.owner.title,
        worksFor: {
          "@id": `${business.url}/#business`,
        },
      },
    ],
  };
}
