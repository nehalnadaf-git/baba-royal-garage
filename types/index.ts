// ============================================================
// Shared TypeScript types for Baba Royal Garage
// ============================================================

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  mapEmbed?: string;
}

export interface BusinessHours {
  weekdays: string;
  sunday: string;
  short: string;
  opens: string;
  closes: string;
  days: string[];
}

export interface BusinessOwner {
  name: string;
  title: string;
  description: string;
}

export interface Business {
  name: string;
  tagline: string;
  slogan: string;
  shortDescription: string;
  fullDescription: string;
  url: string;
  phone1: string;
  phone1Display: string;
  phone1Name: string;
  phone2: string;
  phone2Display: string;
  phone2Name: string;
  whatsapp: string;
  whatsappUrl: string;
  experience: string;
  bikesServiced: string;
  payment: string[];
  hours: BusinessHours;
  branches: Branch[];
  owner: BusinessOwner;
  social: {
    whatsapp: string;
  };
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: "regular" | "engine" | "electrical" | "suspension" | "detailing" | "doorstep";
  icon: string;
  commonProblems: string[];
  whatWeInclude: string[];
  signsYouNeed: string[];
  brandsModels: string[];
  timeEstimate: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  faqs: ServiceFAQ[];
  relatedServices: string[];
  cardCategory?: string;
  cardFeatures?: string[];
  cardPrice?: string;
  cardImage?: string;
  cardImageAlt?: string;
}

export interface REModel {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  description: string;
  year: string;
  engineType: string;
  commonIssues: string[];
  recommendedServices: string[];
  metaTitle: string;
  metaDescription: string;
  faqs: ServiceFAQ[];
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  city: "Hubli";
  description: string;
  landmarks: string[];
  nearestBranch: "keshwapur" | "nehru-stadium";
  distanceFromBranch: string;
  metaTitle: string;
  metaDescription: string;
  faqs: ServiceFAQ[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  tags: string[];
  image?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "booking" | "services" | "pricing" | "parts" | "doorstep" | "models" | "location";
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  text?: string; // optional alias for review field
  date: string;
  relativeDate?: string;
  profilePhoto?: string;
  source?: "internal" | "google";
  model?: string;
  service?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "Workshop" | "Bikes" | "Engine Work" | "Before & After" | "Team";
  label: string;
  width: number;
  height: number;
}
