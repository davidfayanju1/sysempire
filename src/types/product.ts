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

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: ProductImage[];
  category: string;
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
  material: string;
  careInstructions: string[];
  fit: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  sku: string;
}
