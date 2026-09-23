import { describe, expect, it } from "vitest";
import { OUTFIT_TYPE_IDS, type Customizations } from "./customizationFields";
import { buildGarmentSketch, type GarmentSketch } from "./garmentSketch";

const allPaths = (sketch: GarmentSketch) => [
  ...sketch.body,
  ...sketch.pieces.map((piece) => piece.d),
];

/** Lowest point of the garment itself: the body's legs always reach the ankle. */
const hemY = (sketch: GarmentSketch) =>
  Math.max(
    ...sketch.pieces
      .map((piece) => piece.d)
      .flatMap((d) => d.match(/,(\d+(?:\.\d+)?)/g) ?? [])
      .map((match) => Number(match.slice(1))),
  );

describe("buildGarmentSketch", () => {
  // A missing or misspelled answer would show up as "NaN" inside a path, which
  // silently drops the shape from the drawing rather than throwing.
  it("never emits a malformed path, at any stage of answering", () => {
    const partials: Customizations[] = [
      {},
      { fit: "Slim" },
      { wearer: "Womenswear", fit: "Relaxed" },
      { suitFor: "Men's Tailoring", fit: "Tailored", composition: "Three-Piece" },
      { fit: "Regular", length: "Maxi", silhouette: "Mermaid", neckline: "Halter", sleeveType: "Bell" },
      { fit: "Regular", trouserStyle: "Flared", capStyle: "Fila", embroidery: "Premium", neckStyle: "Mandarin", sleeveType: "3/4" },
      { fit: "Regular", role: "Bride", formality: "Formal" },
      { fit: "Regular", skirtOrTrousers: "Both", jacketStyle: "Double-Breasted" },
    ];

    for (const outfitType of OUTFIT_TYPE_IDS) {
      for (const values of partials) {
        for (const wearer of ["men", "women", undefined] as const) {
          const sketch = buildGarmentSketch(outfitType, wearer, values);
          const bad = allPaths(sketch).filter(
            (d) => d.includes("NaN") || d.includes("undefined"),
          );
          expect(bad, `${outfitType} / ${wearer} / ${JSON.stringify(values)}`).toEqual([]);
        }
      }
    }
  });

  it("draws the hem where the length answer says", () => {
    const dress = (length: string) =>
      hemY(buildGarmentSketch("dresses", "women", { fit: "Regular", length }));

    expect(dress("Mini")).toBeLessThan(dress("Knee"));
    expect(dress("Knee")).toBeLessThan(dress("Midi"));
    expect(dress("Midi")).toBeLessThan(dress("Maxi"));
  });

  it("changes the drawing when the fit changes", () => {
    const sketchFor = (fit: string) =>
      JSON.stringify(buildGarmentSketch("suits", "men", { fit, suitFor: "Men's Tailoring" }).pieces);

    expect(sketchFor("Slim")).not.toEqual(sketchFor("Relaxed"));
  });

  it("gives men and women different figures", () => {
    const men = buildGarmentSketch("casual", "men", {});
    const women = buildGarmentSketch("casual", "women", {});
    expect(men.body).not.toEqual(women.body);
    expect(men.head.r).not.toEqual(women.head.r);
  });

  it("puts a cap on the head only when one is chosen", () => {
    const without = buildGarmentSketch("native-wear", "men", { capStyle: "None" });
    const with_ = buildGarmentSketch("native-wear", "men", { capStyle: "Fila" });
    expect(with_.pieces.length).toBe(without.pieces.length + 1);
  });
});
