// Looks up the sketch drawn for an option.
//
// Artwork is optimised into src/assets/sketches by scripts/build-sketches.mjs and
// picked up here at build time. Anything not drawn yet simply returns undefined,
// and the card falls back to its TailoringIcon: so the flow works with no
// artwork at all and improves as each batch lands.
import type { Customizations, OutfitType, Wearer } from "./customizationFields";

const sketches = import.meta.glob<string>("/src/assets/sketches/**/*.webp", {
  eager: true,
  import: "default",
});

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getSketch = (path: string): string | undefined =>
  sketches[`/src/assets/sketches/${path}.webp`];

interface OptionSketchArgs {
  outfitType: OutfitType;
  wearer: Wearer | undefined;
  field: string;
  option: string;
}

export function getOptionSketch({
  outfitType,
  wearer,
  field,
  option,
}: OptionSketchArgs): string | undefined {
  const slug = slugify(option);

  switch (field) {
    case "wearer":
      // Reuses the fit figures, so this question needs no artwork of its own.
      return getSketch(
        `fit/${option === "Womenswear" ? "women" : "men"}/regular`,
      );
    case "fit":
      return wearer ? getSketch(`fit/${wearer}/${slug}`) : undefined;
    case "suitFor":
      return getSketch(`suits/suitFor/${slug}`);
    default:
      return outfitType === "suits"
        ? getSketch(`suits-${wearer ?? "men"}/${field}/${slug}`)
        : getSketch(`${outfitType}/${field}/${slug}`);
  }
}

/** The field whose sketch best represents the whole garment in the summary panel. */
const PREVIEW_FIELD: Partial<Record<OutfitType, string>> = {
  suits: "composition",
  dresses: "silhouette",
  corporate: "skirtOrTrousers",
  wedding: "role",
  "native-wear": "trouserStyle",
};

export const getPreviewField = (outfitType: OutfitType): string | undefined =>
  PREVIEW_FIELD[outfitType];

export function getPreviewSketch(
  outfitType: OutfitType,
  wearer: Wearer | undefined,
  values: Customizations,
): string | undefined {
  const field = PREVIEW_FIELD[outfitType];
  const option = field ? values[field] : undefined;
  const specific =
    field && option
      ? getOptionSketch({ outfitType, wearer, field, option })
      : undefined;
  return specific ?? getSketch(`outfit-type/${outfitType}`);
}
