// types/api-collection.ts
// Shape returned by the backend /collections endpoints.
export interface ApiCollection {
  id: string;
  name: string;
  tagline?: string;
  year: number;
  season: string;
  description: string;
  pieceCount: number;
  coverImage: string;
  featured: boolean;
  isPublished: boolean;
  order: number;
  gallery: string[];
  publishedAt: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  gender: "male" | "female";
}

export interface ApiCollectionProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiCollectionProductRating {
  average: number;
  count: number;
}

// Shape returned by GET /collections/:id/products — a lighter summary than
// the full ApiProduct returned by GET /products.
export interface ApiCollectionProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category: ApiCollectionProductCategory | null;
  rating: ApiCollectionProductRating;
  inStock: boolean;
}
