// Manifest check: fails when an option in the flow has no artwork.
//
// Every scope in PENDING is skipped. Remove a scope when its batch lands, and
// the test then lists exactly which files are still missing. When PENDING is
// empty, every option in Step 1, Step 4 and the Step 5 croquis is covered.
import { describe, expect, it } from "vitest";
import {
  FIT_FIELD,
  OUTFIT_FIELDS,
  SUIT_FIELDS,
  SUIT_FOR_FIELD,
} from "./customizationFields";
import { OUTFIT_TYPES } from "./outfitTypes";
import { getSketch, slugify } from "./sketchRegistry";

const PENDING = new Set<string>([
  "fit",
  "suits-men",
  "suits-women",
  "outfit-type",
  "native-wear",
  "dresses",
  "corporate",
  "wedding",
  "croquis",
]);

const expectAll = (paths: string[]) => {
  const missing = paths.filter((path) => getSketch(path) === undefined);
  expect(missing).toEqual([]);
};

describe("slugify", () => {
  it("builds stable file names", () => {
    expect(slugify("Men's Tailoring")).toBe("mens-tailoring");
    expect(slugify("3/4")).toBe("3-4");
    expect(slugify("Double-Breasted")).toBe("double-breasted");
    expect(slugify("Okpu Agu")).toBe("okpu-agu");
    expect(slugify("White/Ivory")).toBe("white-ivory");
  });
});

describe("sketch manifest", () => {
  it.skipIf(PENDING.has("fit"))("fit and suitFor", () => {
    expectAll([
      ...(["men", "women"] as const).flatMap((wearer) =>
        FIT_FIELD.options.map((option) => `fit/${wearer}/${slugify(option)}`),
      ),
      ...SUIT_FOR_FIELD.options.map(
        (option) => `suits/suitFor/${slugify(option)}`,
      ),
    ]);
  });

  for (const wearer of ["men", "women"] as const) {
    it.skipIf(PENDING.has(`suits-${wearer}`))(`suits-${wearer}`, () => {
      expectAll(
        SUIT_FIELDS[wearer].flatMap((field) =>
          field.options.map(
            (option) => `suits-${wearer}/${field.name}/${slugify(option)}`,
          ),
        ),
      );
    });
  }

  for (const [outfitType, fields] of Object.entries(OUTFIT_FIELDS)) {
    if (fields.length === 0) continue;
    it.skipIf(PENDING.has(outfitType))(outfitType, () => {
      expectAll(
        fields
          .filter((field) => !("kind" in field && field.kind === "swatch"))
          .flatMap((field) =>
            field.options.map(
              (option) => `${outfitType}/${field.name}/${slugify(option)}`,
            ),
          ),
      );
    });
  }

  it.skipIf(PENDING.has("outfit-type"))("outfit-type", () => {
    expectAll(OUTFIT_TYPES.map((type) => `outfit-type/${type.id}`));
  });

  it.skipIf(PENDING.has("croquis"))("croquis", () => {
    expectAll(["croquis/female", "croquis/male"]);
  });
});
