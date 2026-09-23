import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OptionCard from "./OptionCard";

describe("OptionCard", () => {
  it("reports its pressed state and selects on click", async () => {
    const onSelect = vi.fn();
    render(
      <OptionCard
        label="Peak"
        crop="detail"
        image="/peak.webp"
        fallbackIcon={null}
        selected={false}
        onSelect={onSelect}
      />,
    );
    const card = screen.getByRole("button", { name: "Peak" });
    expect(card).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(card);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("falls back to the icon when there is no sketch", () => {
    render(
      <OptionCard
        label="Peak"
        crop="detail"
        image={undefined}
        fallbackIcon={<svg />}
        selected
        onSelect={() => {}}
      />,
    );
    expect(screen.getByTestId("option-fallback")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Peak" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
