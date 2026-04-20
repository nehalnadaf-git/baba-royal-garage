import { NextResponse } from "next/server";
import { reviews as fallbackReviews } from "@/lib/reviews";
import type { Review } from "@/types";

export const revalidate = 86400;

type GooglePlaceReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
};

type GooglePlaceDetailsResponse = {
  status?: string;
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GooglePlaceReview[];
  };
};

function buildFallbackReviews(): Review[] {
  return fallbackReviews.slice(0, 5).map((review) => ({
    ...review,
    relativeDate: review.date,
    source: "internal",
  }));
}

function normalizeGoogleReviews(reviews: GooglePlaceReview[]): Review[] {
  return reviews.slice(0, 5).map((review, index) => ({
    id: `google-review-${index + 1}`,
    name: review.author_name ?? "Verified Rider",
    rating: Math.max(1, Math.min(5, review.rating ?? 5)),
    review: review.text?.trim() || "Great Royal Enfield service experience in Hubli.",
    text: review.text?.trim() || "Great Royal Enfield service experience in Hubli.",
    date: review.relative_time_description ?? "Recently",
    relativeDate: review.relative_time_description ?? "Recently",
    profilePhoto: review.profile_photo_url,
    source: "google",
  }));
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      {
        source: "fallback",
        reviews: buildFallbackReviews(),
      },
      { status: 200 },
    );
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "name,rating,user_ratings_total,reviews");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      method: "GET",
      next: { revalidate: 86400 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Places response status ${response.status}`);
    }

    const payload = (await response.json()) as GooglePlaceDetailsResponse;

    if (payload.status !== "OK" || !payload.result?.reviews?.length) {
      return NextResponse.json(
        {
          source: "fallback",
          reviews: buildFallbackReviews(),
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        source: "google",
        businessRating: payload.result.rating,
        totalRatings: payload.result.user_ratings_total,
        reviews: normalizeGoogleReviews(payload.result.reviews),
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        source: "fallback",
        reviews: buildFallbackReviews(),
      },
      { status: 200 },
    );
  }
}
