import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "../lib/format";
import { getProductImage } from "../lib/productImage";
import { useCart } from "../state/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Start shopping to add items to your cart
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Deals
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id.toString()}
              className="bg-card border border-border rounded-lg p-4 flex gap-4"
            >
              <img
                src={getProductImage(item.product.name)}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg bg-muted"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1 truncate">
                  {item.product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.product.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-input rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-3 py-1 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-input font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-3 py-1 hover:bg-muted transition-colors"
                      disabled={item.quantity >= Number(item.product.stock)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    aria-label="Remove item"
                    data-ocid="cart.delete_button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(Number(item.product.price) * item.quantity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(Number(item.product.price))} each
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Items ({itemCount})
                </span>
                <span className="text-foreground font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/checkout" })}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              data-ocid="cart.primary_button"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/"
              className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
