// types/api-product.ts
// Shape returned by the backend /products endpoints (list + single).
export interface ApiProductImage {
  url: string;
  isPrimary: boolean;
}

export interface ApiProductColor {
  name: string;
  hex: string;
}

export interface ApiProductVariant {
  id: string;
  color: string;
  sizes: string[];
}

export interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface ApiProductRating {
  average: number;
  count: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  finalPrice: number;
  onSale: boolean;
  currency: string;
  stock: number;
  trackInventory: boolean;
  images: ApiProductImage[];
  colors: ApiProductColor[];
  variants: ApiProductVariant[];
  materials: string[];
  careInstructions: string[];
  rating: ApiProductRating;
  category: ApiProductCategory | null;
  slug: string;
}
