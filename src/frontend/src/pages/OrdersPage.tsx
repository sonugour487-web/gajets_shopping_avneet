import { Link } from "@tanstack/react-router";
import { Package, ShoppingBag } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetOrdersByBuyer } from "../hooks/useQueries";
import { formatPrice } from "../lib/format";
import { getSessionOrders } from "../lib/ordersSession";

export default function OrdersPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: orders = [], isLoading } = useGetOrdersByBuyer(principal);

  const sessionOrderIds = getSessionOrders();
  const displayOrders = principal
    ? orders
    : orders.filter((o) => sessionOrderIds.includes(o.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (displayOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          No orders yet
        </h2>
        <p className="text-muted-foreground mb-6">
          Start shopping to see your orders here
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">My Orders</h1>

      <div className="space-y-4">
        {displayOrders.map((order) => (
          <div
            key={order.id.toString()}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Order #{order.id.toString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(
                      Number(order.timestamp) / 1000000,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(Number(order.totalAmount))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.productIds.length}{" "}
                  {order.productIds.length === 1 ? "item" : "items"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
