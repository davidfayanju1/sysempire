// Step 1 categories and their starting prices. Single source for both the
// outfit-type grid and the Step 8 price calculation.
import type { OutfitType } from "./customizationFields";

interface OutfitTypeDef {
  readonly id: OutfitType;
  readonly name: string;
  readonly examples: string;
  readonly basePrice: number;
}

export const OUTFIT_TYPES = [
  {
    id: "native-wear",
    name: "Native Wear",
    examples: "Agbada, Kaftan, Dashiki, Buba, Iro ati Buba",
    basePrice: 85_000,
  },
  {
    id: "corporate",
    name: "Corporate Wear",
    examples: "Suits, blazers, corporate dresses, workwear",
    basePrice: 70_000,
  },
  {
    id: "dresses",
    name: "Dresses",
    examples: "Evening gowns, cocktail dresses, day dresses",
    basePrice: 60_000,
  },
  {
    id: "suits",
    name: "Suits",
    examples: "Two-piece, three-piece, tuxedos",
    basePrice: 75_000,
  },
  {
    id: "casual",
    name: "Casual Wear",
    examples: "Everyday comfort, weekend style",
    basePrice: 45_000,
  },
  {
    id: "wedding",
    name: "Wedding Wear",
    examples: "Bride, groom, bridesmaids, mothers of the couple",
    basePrice: 120_000,
  },
  {
    id: "uniforms",
    name: "Uniforms",
    examples: "Corporate uniforms, school uniforms, team wear",
    basePrice: 40_000,
  },
  {
    id: "other",
    name: "Something Else",
    examples: "Tell us what you have in mind",
    basePrice: 65_000,
  },
] as const satisfies readonly OutfitTypeDef[];

export const FALLBACK_BASE_PRICE = 65_000;

export const getBasePrice = (id: string | null | undefined): number =>
  OUTFIT_TYPES.find((type) => type.id === id)?.basePrice ?? FALLBACK_BASE_PRICE;
