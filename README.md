# Baba Royal Garage Website

Production Next.js 16 App Router website for Baba Royal Garage, Hubli.

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + custom design tokens
- App Router metadata + JSON-LD schema
- Server-side reviews API fallback strategy

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Environment Variables

The reviews endpoint reads Google Places data server-side:

- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

If these are not configured, the site automatically falls back to local static reviews.

## SEO and Crawling

- `app/sitemap.ts` generates dynamic sitemap entries for static, service, model, location, and blog routes.
- `public/robots.txt` allows normal crawling, disallows `/api/`, and points to `https://babaroyalgarage.com/sitemap.xml`.

## Build and Validation

```bash
npm run lint
npm run build
```
