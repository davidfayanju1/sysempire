// The glass styling hangs off sonner's class hooks and data-type attributes.
// If an upgrade renames either, the toasts silently fall back to unstyled text,
// which is easy to miss. These assertions fail instead.
import { render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it } from "vitest";
import GlassToaster from "./GlassToaster";

afterEach(() => toast.dismiss());

const showAndFind = async (message: string) => {
  render(<GlassToaster />);
  toast.error(message);
  return waitFor(() => screen.getByText(message));
};

describe("GlassToaster", () => {
  it("styles the toast through sonner's class hooks", async () => {
    const title = await showAndFind("Could not place your order.");
    expect(title).toHaveClass("sys-toast-title");

    const toastEl = title.closest("[data-sonner-toast]");
    expect(toastEl).toHaveClass("sys-toast");
    // Sonner's own box styling must stay off, or it fights the glass.
    expect(toastEl).toHaveAttribute("data-styled", "false");
    // The eyebrow label is chosen in CSS from this attribute.
    expect(toastEl).toHaveAttribute("data-type", "error");
  });

  it("marks success toasts so they get the champagne accent", async () => {
    render(<GlassToaster />);
    toast.success("Profile updated.");
    const title = await waitFor(() => screen.getByText("Profile updated."));
    expect(title.closest("[data-sonner-toast]")).toHaveAttribute(
      "data-type",
      "success",
    );
  });
});
