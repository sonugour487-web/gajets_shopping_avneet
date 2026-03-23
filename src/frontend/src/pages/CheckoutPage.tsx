import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCreateOrder } from "../hooks/useQueries";
import { formatPrice } from "../lib/format";
import { saveOrderToSession } from "../lib/ordersSession";
import { useCart } from "../state/cart";

const PAYMENT_METHODS = [
  { id: "googlepay", label: "Google Pay", emoji: "🟢", color: "#34A853" },
  { id: "phonepe", label: "PhonePe", emoji: "🟣", color: "#5F259F" },
  { id: "upi", label: "UPI", emoji: "💳", color: "#FF6B35" },
  { id: "credit_card", label: "Credit Card", emoji: "💳", color: "#1A56DB" },
  { id: "debit_card", label: "Debit Card", emoji: "🏦", color: "#0E9F6E" },
  { id: "netbanking", label: "Net Banking", emoji: "🏛️", color: "#9B1C1C" },
  { id: "cod", label: "Cash on Delivery", emoji: "💵", color: "#B45309" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function computeDeliveryDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return `${d.getDate().toString().padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("googlepay");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  // Stable delivery charge seeded from subtotal
  const deliveryCharge = useMemo(() => {
    const seed = subtotal % 201; // 0..200
    return 600 + seed; // 600..800
  }, [subtotal]);

  // Stable delivery days seeded from subtotal
  const deliveryDays = useMemo(() => {
    return 5 + (subtotal % 3); // 5, 6, or 7
  }, [subtotal]);

  const deliveryDate = useMemo(
    () => computeDeliveryDate(deliveryDays),
    [deliveryDays],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productIds: bigint[] = [];
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          productIds.push(item.product.id);
        }
      }

      const orderId = await createOrder.mutateAsync({
        productIds,
        phone: formData.phone,
        paymentMethod: selectedPayment,
        deliveryCharge: BigInt(deliveryCharge),
        deliveryDate,
      });

      // Store meta in sessionStorage for confirmation page
      sessionStorage.setItem(
        "lastOrderMeta",
        JSON.stringify({
          phone: formData.phone,
          paymentMethod: selectedPayment,
          deliveryDate,
          deliveryCharge,
        }),
      );

      saveOrderToSession(orderId);
      clearCart();
      navigate({
        to: "/order-confirmation/$orderId",
        params: { orderId: orderId.toString() },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate({ to: "/cart" });
    return null;
  }

  const total = subtotal + deliveryCharge;
  const paymentLabel =
    PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label ??
    selectedPayment;

  const isCOD = selectedPayment === "cod";

  return (
    <div className="max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => navigate({ to: "/cart" })}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="checkout.secondary_button"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </button>

      <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          {/* Delivery Info */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Delivery Information
            </h2>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your full name"
                data-ocid="checkout.input"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Phone Number *{" "}
                <span className="text-xs text-muted-foreground">
                  (SMS confirmation will be sent to this number)
                </span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+91 XXXXX XXXXX"
                data-ocid="checkout.input"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Delivery Address *
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Enter your complete delivery address"
                data-ocid="checkout.textarea"
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Order Note (Optional)
              </label>
              <textarea
                id="note"
                rows={2}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Any special instructions?"
                data-ocid="checkout.textarea"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                  data-ocid="checkout.toggle"
                >
                  <span className="text-2xl">{method.emoji}</span>
                  <span className="text-xs font-semibold text-foreground text-center">
                    {method.label}
                  </span>
                  {selectedPayment === method.id && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected:{" "}
              <strong className="text-foreground">{paymentLabel}</strong>
            </p>
            {isCOD && (
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-300">
                💵 You will pay <strong>{formatPrice(total)}</strong> in cash
                when your order is delivered.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            data-ocid="checkout.submit_button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Placing Order...
              </>
            ) : isCOD ? (
              "Place Order - Pay on Delivery"
            ) : (
              `Place Order via ${paymentLabel}`
            )}
          </button>
        </form>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Order Summary
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span className="text-foreground">
                  {formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1">
              <p className="text-muted-foreground">
                🚚{" "}
                <strong className="text-foreground">Estimated Delivery</strong>
              </p>
              <p className="text-foreground font-semibold">{deliveryDate}</p>
              <p className="text-muted-foreground">(5–7 business days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
