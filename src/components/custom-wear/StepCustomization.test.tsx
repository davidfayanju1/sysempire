import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import StepCustomization from "./StepCustomization";

const setup = () => {
  const onNext = vi.fn();
  render(
    <StepCustomization
      outfitType="suits"
      estimate={() => 75_000}
      onNext={onNext}
      onBack={() => {}}
    />,
  );
  const pick = (name: string) =>
    userEvent.click(screen.getByRole("button", { name }));
  return { onNext, pick };
};

describe("StepCustomization", () => {
  it("unlocks Continue only when every required field is answered", async () => {
    const { onNext, pick } = setup();
    const next = screen.getByRole("button", { name: "Continue" });
    expect(next).toBeDisabled();

    await pick("Men's Tailoring");
    for (const option of [
      "Tailored",
      "Two-Piece",
      "Peak",
      "Two-Button",
      "Double Vent",
    ]) {
      await pick(option);
    }
    expect(next).toBeDisabled();

    await pick("Flap");
    expect(next).toBeEnabled();

    await userEvent.click(next);
    expect(onNext).toHaveBeenCalledWith(
      {
        suitFor: "Men's Tailoring",
        fit: "Tailored",
        composition: "Two-Piece",
        lapelStyle: "Peak",
        buttons: "Two-Button",
        vents: "Double Vent",
        pockets: "Flap",
      },
      "men",
    );
  });

  it("swaps to womenswear options and drops menswear answers", async () => {
    const { pick } = setup();
    await pick("Men's Tailoring");
    await pick("Tuxedo");
    await pick("Women's Tailoring");

    expect(
      screen.queryByRole("button", { name: "Tuxedo" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pantsuit" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      screen.queryByRole("group", { name: "Vents" }),
    ).not.toBeInTheDocument();
  });

  it("clears an optional field when its chosen option is tapped again", async () => {
    const onNext = vi.fn();
    render(
      <StepCustomization
        outfitType="native-wear"
        initialValues={{
          wearer: "Menswear",
          fit: "Regular",
          neckStyle: "Round",
          sleeveType: "Long",
          embroidery: "None",
          trouserStyle: "Straight",
        }}
        estimate={() => 85_000}
        onNext={onNext}
        onBack={() => {}}
      />,
    );

    const fila = screen.getByRole("button", { name: "Fila" });
    await userEvent.click(fila);
    expect(fila).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(fila);
    expect(fila).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onNext.mock.calls[0][0]).not.toHaveProperty("capStyle");
  });
});
