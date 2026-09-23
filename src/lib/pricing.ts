// Estimated pricing for a Personal Fit order.
//
// This lives outside StepPayment so Step 4 can show a running estimate from the
// same function the final total is built from: the two can never disagree.
// Every amount is an estimate in NGN; the stylist confirms the real price.
import type { OrderData } from "../pages/custom-wear";
import { getBasePrice } from "./outfitTypes";

const EMBROIDERY_PRICES: Record<string, number> = {
  None: 0,
  Minimal: 8000,
  Traditional: 15000,
  Premium: 25000,
};

const WEDDING_ROLE_PRICES: Record<string, number> = {
  Bride: 30000,
  Groom: 10000,
};

export interface PriceBreakdown {
  basePrice: number;
  fabricFee: number;
  embroideryFee: number;
  weddingRoleFee: number;
  weddingFormalityFee: number;
  corporateBothFee: number;
  doubleBreastedFee: number;
  expressFee: number;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

export const calculatePrice = (orderData: OrderData): PriceBreakdown => {
  const c = orderData.customizations;

  const basePrice = getBasePrice(orderData.outfitType);

  const fabricFee =
    orderData.fabricOption === "source-fabric"
      ? orderData.fabricPreferences?.quality === "premium"
        ? 35000
        : 15000
      : orderData.fabricOption === "not-sure"
        ? 15000
        : 0;

  const embroideryFee = EMBROIDERY_PRICES[c.embroidery] ?? 0;
  const weddingRoleFee = WEDDING_ROLE_PRICES[c.role] ?? 0;
  const weddingFormalityFee = c.formality === "Formal" ? 20000 : 0;
  const corporateBothFee = c.skirtOrTrousers === "Both" ? 15000 : 0;
  const doubleBreastedFee =
    c.buttons === "Double-Breasted" || c.jacketStyle === "Double-Breasted"
      ? 5000
      : 0;

  const subtotal =
    basePrice +
    fabricFee +
    embroideryFee +
    weddingRoleFee +
    weddingFormalityFee +
    corporateBothFee +
    doubleBreastedFee;

  const expressFee = orderData.isExpress ? Math.round(subtotal * 0.3) : 0;
  const deliveryFee = orderData.deliveryPreference === "delivery" ? 5000 : 0;
  const total = subtotal + expressFee + deliveryFee;

  return {
    basePrice,
    fabricFee,
    embroideryFee,
    weddingRoleFee,
    weddingFormalityFee,
    corporateBothFee,
    doubleBreastedFee,
    expressFee,
    deliveryFee,
    subtotal,
    total,
  };
};
