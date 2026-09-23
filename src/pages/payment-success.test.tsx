// Flutterwave hands back a different query string for each outcome, and the
// page has to tell them apart before it verifies anything. Getting this wrong
// is what showed "Invalid payment response" to people who simply cancelled.
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentSuccess from "./payment-success";

// vi.mock factories are hoisted above the file, so anything they close over
// has to be hoisted with them.
const { get, clearCart, clearStoredProgress, takePaymentOrigin, origin } =
  vi.hoisted(() => ({
    get: vi.fn(),
    clearCart: vi.fn(),
    clearStoredProgress: vi.fn(),
    takePaymentOrigin: vi.fn(),
    origin: { value: "/cart" },
  }));

vi.mock("../lib/axios", () => ({ default: { get } }));
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}));
vi.mock("../util/useCart", () => ({ useCart: () => ({ clearCart }) }));
vi.mock("../lib/customWearProgress", () => ({ clearStoredProgress }));
vi.mock("../lib/paymentOrigin", () => ({
  takePaymentOrigin: () => takePaymentOrigin() ?? origin.value,
  forgetPaymentOrigin: vi.fn(),
}));

const renderAt = (query: string) =>
  render(
    <MemoryRouter initialEntries={[`/payment/success${query}`]}>
      <Routes>
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<p>Failed page</p>} />
        <Route path="/cart" element={<p>Cart page</p>} />
        <Route path="/custom-wear" element={<p>Personal Fit page</p>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  get.mockReset();
  get.mockResolvedValue({ data: { status: "success" } });
  clearCart.mockReset();
  clearStoredProgress.mockReset();
  takePaymentOrigin.mockReset();
  origin.value = "/cart";
});

describe("PaymentSuccess", () => {
  it("shows the backend's paid order without verifying again", async () => {
    renderAt(
      "?paymentStatus=paid&orderNumber=SE-MU9VW6IZ-D24O&orderId=6aafe70d157460fbcc33374c",
    );
    expect(await screen.findByText("Payment confirmed")).toBeInTheDocument();
    expect(screen.getByText(/SE-MU9VW6IZ-D24O/)).toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
  });

  it("returns a cancelled payment to wherever it started", async () => {
    origin.value = "/cart";
    renderAt("?paymentStatus=cancelled&orderNumber=SE-1");
    expect(await screen.findByText("Cart page")).toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
  });

  it("returns a cancelled bespoke payment to Personal Fit", async () => {
    origin.value = "/custom-wear";
    renderAt("?status=cancelled&tx_ref=SYS-123&transaction_id=0");
    expect(await screen.findByText("Personal Fit page")).toBeInTheDocument();
  });

  it("leaves the cart and saved bespoke answers alone when cancelled", async () => {
    renderAt("?paymentStatus=cancelled&orderNumber=SE-1");
    expect(await screen.findByText("Cart page")).toBeInTheDocument();
    expect(clearCart).not.toHaveBeenCalled();
    expect(clearStoredProgress).not.toHaveBeenCalled();
  });

  it("falls back to the cart when no origin was recorded", async () => {
    renderAt("?paymentStatus=cancelled");
    expect(await screen.findByText("Cart page")).toBeInTheDocument();
  });

  it("empties the cart and saved answers once the payment is confirmed", async () => {
    renderAt("?paymentStatus=paid&orderNumber=SE-3");
    expect(await screen.findByText("Payment confirmed")).toBeInTheDocument();
    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(clearStoredProgress).toHaveBeenCalledTimes(1);
  });

  it("sends a failed payment to the failed page", async () => {
    renderAt("?paymentStatus=failed&orderNumber=SE-2");
    expect(await screen.findByText("Failed page")).toBeInTheDocument();
  });

  it("verifies with tx_ref alone when Flutterwave redirects here directly", async () => {
    renderAt("?status=successful&tx_ref=SYS-123");
    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    expect(get.mock.calls[0][1].params).toEqual({
      tx_ref: "SYS-123",
      status: "successful",
    });
    expect(await screen.findByText("Payment confirmed")).toBeInTheDocument();
  });

  it("offers a way forward when the response carries nothing at all", async () => {
    renderAt("");
    expect(
      await screen.findByText(/could not confirm this yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view my orders/i }),
    ).toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
  });

  it("explains a verification failure rather than bouncing home", async () => {
    get.mockRejectedValue(new Error("502"));
    renderAt("?status=successful&tx_ref=SYS-9&transaction_id=88");
    expect(
      await screen.findByText(/could not confirm this yet/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/do not pay again/i)).toBeInTheDocument();
  });
});
