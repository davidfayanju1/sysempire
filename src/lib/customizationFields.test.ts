import { describe, expect, it } from "vitest";
import {
  applySelection,
  deriveWearer,
  getFields,
  isComplete,
  pickVisible,
} from "./customizationFields";

const names = (fields: readonly { name: string }[]) =>
  fields.map((field) => field.name);

describe("getFields", () => {
  it("shows only suitFor until a suit wearer is chosen", () => {
    expect(names(getFields("suits", {}))).toEqual(["suitFor"]);
  });

  it("reveals the men's suit fields in order", () => {
    expect(names(getFields("suits", { suitFor: "Men's Tailoring" }))).toEqual([
      "suitFor",
      "fit",
      "composition",
      "lapelStyle",
      "buttons",
      "vents",
      "pockets",
    ]);
  });

  it("does not ask dresses who they are for", () => {
    expect(names(getFields("dresses", {}))[0]).toBe("fit");
    expect(deriveWearer("dresses", {})).toBe("women");
  });

  it("asks native wear who it is for first", () => {
    expect(names(getFields("native-wear", {}))[0]).toBe("wearer");
    expect(deriveWearer("native-wear", { wearer: "Womenswear" })).toBe("women");
  });
});

describe("applySelection", () => {
  it("clears suit details when suitFor changes", () => {
    const before = {
      suitFor: "Men's Tailoring",
      fit: "Slim",
      composition: "Tuxedo",
      vents: "No Vent",
    };
    expect(applySelection(before, "suitFor", "Women's Tailoring")).toEqual({
      suitFor: "Women's Tailoring",
      fit: "Slim",
    });
  });

  it("keeps details when the same suitFor is chosen again", () => {
    const before = { suitFor: "Men's Tailoring", composition: "Tuxedo" };
    expect(applySelection(before, "suitFor", "Men's Tailoring")).toEqual(before);
  });
});

describe("completion", () => {
  it("ignores the optional cap", () => {
    const values = {
      wearer: "Menswear",
      fit: "Regular",
      neckStyle: "Round",
      sleeveType: "Long",
      embroidery: "Minimal",
      trouserStyle: "Straight",
    };
    expect(isComplete(getFields("native-wear", values), values)).toBe(true);
  });

  it("is incomplete while a required field is unanswered", () => {
    const values = { wearer: "Menswear" };
    expect(isComplete(getFields("native-wear", values), values)).toBe(false);
  });

  it("drops answers to hidden fields", () => {
    const fields = getFields("dresses", {});
    expect(pickVisible(fields, { fit: "Slim", vents: "No Vent" })).toEqual({
      fit: "Slim",
    });
  });
});
