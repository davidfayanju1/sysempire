import type { ApiProduct } from "../types/api-product";
import type { Product } from "../types/product";

// Some products only have a placeholder hex (e.g. "#000000") rather than a real
// swatch color. Fall back to a color derived from the name so swatches are still
// visually distinct instead of all rendering black.
const isPlaceholderHex = (hex?: string) => !hex || /^#(000000|ffffff)$/i.test(hex);

const hashToHslColor = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 55%)`;
};

const resolveSwatchColor = (name: string, hex?: string): string =>
  isPlaceholderHex(hex) ? hashToHslColor(name) : (hex as string);

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const sizes = Array.from(
    new Set(apiProduct.variants?.flatMap((variant) => variant.sizes) ?? []),
  );

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.finalPrice,
    description: apiProduct.description,
    images: (apiProduct.images ?? []).map((image, index) => ({
      id: index,
      url: image.url,
      alt: apiProduct.name,
    })),
    category: apiProduct.category?.name ?? "Uncategorized",
    sizes,
    variants: apiProduct.variants ?? [],
    colors: (apiProduct.colors ?? []).map((color) => ({
      name: color.name,
      code: resolveSwatchColor(color.name, color.hex),
    })),
    rating: apiProduct.rating?.average ?? 0,
    reviews: apiProduct.rating?.count ?? 0,
    inStock: apiProduct.stock > 0,
    sku: apiProduct.sku,
    material: apiProduct.materials?.length
      ? apiProduct.materials.join(", ")
      : "N/A",
    careInstructions: apiProduct.careInstructions ?? [],
    fit: "",
  };
};
