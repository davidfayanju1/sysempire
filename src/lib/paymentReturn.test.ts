import { describe, expect, it } from "vitest";
import { classifyPaymentReturn } from "./paymentReturn";

const classify = (query: string) =>
  classifyPaymentReturn(new URLSearchParams(query));

describe("classifyPaymentReturn", () => {
  describe("our backend's redirect", () => {
    it("reads a paid order, and does not ask the browser to verify again", () => {
      // The exact URL a real order came back with.
      expect(
        classify(
          "paymentStatus=paid&orderNumber=SE-MU9VW6IZ-D24O&orderId=6aafe70d157460fbcc33374c",
        ),
      ).toEqual({
        kind: "paid",
        orderNumber: "SE-MU9VW6IZ-D24O",
        reference: "SE-MU9VW6IZ-D24O",
      });
    });

    it("recognises a cancelled payment", () => {
      expect(classify("paymentStatus=cancelled&orderNumber=SE-1")).toEqual({
        kind: "cancelled",
        reference: "SE-1",
      });
    });

    it("recognises a failed payment", () => {
      expect(classify("paymentStatus=failed&orderId=abc")).toEqual({
        kind: "failed",
        reference: "abc",
      });
    });
  });

  describe("Flutterwave's own redirect", () => {
    it("asks for verification when a transaction comes back", () => {
      expect(
        classify("status=successful&tx_ref=SYS-123&transaction_id=99"),
      ).toEqual({
        kind: "verify",
        transactionId: "99",
        txRef: "SYS-123",
        status: "successful",
      });
    });

    it("still verifies when only the reference survives", () => {
      expect(classify("tx_ref=SYS-123")).toEqual({
        kind: "verify",
        transactionId: null,
        txRef: "SYS-123",
        status: "successful",
      });
    });

    it("treats transaction_id=0 as no transaction", () => {
      expect(classify("status=cancelled&tx_ref=SYS-1&transaction_id=0")).toEqual(
        { kind: "cancelled", reference: "SYS-1" },
      );
    });
  });

  it("reports an empty query string as unreadable", () => {
    expect(classify("")).toEqual({ kind: "unreadable" });
  });

  it("trusts a paid status even with no order attached", () => {
    expect(classify("paymentStatus=paid")).toEqual({
      kind: "paid",
      orderNumber: null,
      reference: null,
    });
  });
});
