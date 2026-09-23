/** Gateways disagree on spelling, and send "0" or "" for "no value". */
const readParam = (params: URLSearchParams, names: string[]): string | null => {
  for (const name of names) {
    const value = params.get(name)?.trim();
    if (value && value !== "0" && value !== "null" && value !== "undefined") {
      return value;
    }
  }
  return null;
};

const PAID = ["paid", "successful", "success", "completed"];
const CANCELLED = ["cancelled", "canceled"];
const FAILED = ["failed", "error", "declined", "abandoned"];

export type PaymentReturn =
  | { kind: "paid"; orderNumber: string | null; reference: string | null }
  | { kind: "cancelled"; reference: string | null }
  | { kind: "failed"; reference: string | null }
  /** Flutterwave redirected straight here, so the charge is still unconfirmed. */
  | {
      kind: "verify";
      transactionId: string | null;
      txRef: string | null;
      status: string;
    }
  | { kind: "unreadable" };

export function classifyPaymentReturn(params: URLSearchParams): PaymentReturn {
  const orderNumber = readParam(params, ["orderNumber", "order_number"]);
  const orderId = readParam(params, ["orderId", "order_id"]);
  const txRef = readParam(params, ["tx_ref", "txref", "txRef", "reference"]);
  const transactionId = readParam(params, [
    "transaction_id",
    "transactionId",
    "id",
  ]);

  const outcome = (
    readParam(params, ["paymentStatus", "payment_status", "status"]) ?? ""
  ).toLowerCase();

  const reference = orderNumber ?? txRef ?? orderId ?? transactionId;

  if (CANCELLED.includes(outcome)) return { kind: "cancelled", reference };
  if (FAILED.includes(outcome)) return { kind: "failed", reference };

  // The backend only sends an order back once it has confirmed the charge, so
  // there is nothing left to verify from the browser.
  if (PAID.includes(outcome) && (orderNumber || orderId)) {
    return { kind: "paid", orderNumber, reference };
  }

  if (txRef || transactionId) {
    return {
      kind: "verify",
      transactionId,
      txRef,
      status: outcome || "successful",
    };
  }

  // "paid" with no order attached still means paid; show it rather than alarm
  // someone whose money has left their account.
  if (PAID.includes(outcome))
    return { kind: "paid", orderNumber: null, reference };

  return { kind: "unreadable" };
}
