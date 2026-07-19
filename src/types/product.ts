// types/product.ts
export interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

export interface ProductColor {
  name: string;
  code: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  sizes: string[];
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  description: string;
  images: ProductImage[];
  category: string;
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
  material: string;
  careInstructions: string[];
  fit: string;
}
