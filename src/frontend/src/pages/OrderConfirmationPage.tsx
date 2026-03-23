import { Link, useParams } from "@tanstack/react-router";
import { CheckCircle, Home, MessageSquare, Package, Truck } from "lucide-react";
import { useGetOrder } from "../hooks/useQueries";
import { formatPrice } from "../lib/format";

const PAYMENT_LABELS: Record<string, string> = {
  googlepay: "Google Pay",
  phonepe: "PhonePe",
  upi: "UPI",
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
};

interface OrderMeta {
  phone: string;
  paymentMethod: string;
  deliveryDate: string;
  deliveryCharge: number;
}

function readOrderMeta(): OrderMeta | null {
  try {
    const raw = sessionStorage.getItem("lastOrderMeta");
    if (!raw) return null;
    return JSON.parse(raw) as OrderMeta;
  } catch {
    return null;
  }
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));
  const meta = readOrderMeta();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="order_confirmation.loading_state"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="max-w-2xl mx-auto text-center py-12"
        data-ocid="order_confirmation.error_state"
      >
        <p className="text-muted-foreground text-lg mb-4">Order not found</p>
        <Link
          to="/"
          className="text-primary hover:underline"
          data-ocid="order_confirmation.link"
        >
          Return to catalog
        </Link>
      </div>
    );
  }

  const phone = meta?.phone || order.phone || "";
  const paymentMethod = meta?.paymentMethod || order.paymentMethod || "";
  const deliveryDate = meta?.deliveryDate || order.deliveryDate || "";
  const deliveryCharge = meta?.deliveryCharge ?? Number(order.deliveryCharge);
  const paymentLabel = PAYMENT_LABELS[paymentMethod] || paymentMethod;
  const isCOD = paymentMethod === "cod";

  return (
    <div
      className="max-w-2xl mx-auto space-y-6"
      data-ocid="order_confirmation.panel"
    >
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order is being processed.
        </p>
        <div className="mt-4 inline-block bg-muted/60 rounded-lg px-4 py-2 text-sm">
          <span className="text-muted-foreground">Order ID: </span>
          <span className="font-bold text-foreground">
            #{order.id.toString()}
          </span>
        </div>
      </div>

      {/* COD Notice */}
      {isCOD && (
        <div
          className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-5 flex items-start gap-4"
          data-ocid="order_confirmation.info_state"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg">
            💵
          </div>
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm mb-1">
              Cash on Delivery
            </p>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              Please keep{" "}
              <strong>{formatPrice(Number(order.totalAmount))}</strong> ready to
              pay when your order arrives.
            </p>
          </div>
        </div>
      )}

      {/* SMS Confirmation Banner */}
      {phone && (
        <div
          className="bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded-xl p-5 flex items-start gap-4"
          data-ocid="order_confirmation.success_state"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300 text-sm mb-1">
              SMS Sent!
            </p>
            <p className="text-green-700 dark:text-green-400 text-sm">
              SMS sent to <strong className="font-bold">{phone}</strong>:{" "}
              <span className="italic">"Your order is confirmed! 🎉"</span>
            </p>
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Truck className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Delivery Details
          </h2>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Your order will arrive by
          </p>
          <p className="text-2xl font-bold text-primary">{deliveryDate}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Charge</span>
            <span className="font-medium text-foreground">
              {formatPrice(deliveryCharge)}
            </span>
          </div>
          {paymentLabel && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium text-foreground">
                {paymentLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Order Summary
          </h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium text-foreground">
              {order.productIds.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-bold text-primary text-base">
              {formatPrice(Number(order.totalAmount))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Date</span>
            <span className="font-medium text-foreground">
              {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/orders"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg font-semibold text-center transition-colors"
          data-ocid="order_confirmation.link"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3 rounded-lg font-semibold text-center flex items-center justify-center gap-2 transition-colors"
          data-ocid="order_confirmation.link"
        >
          <Home className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
