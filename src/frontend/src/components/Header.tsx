import { Link, useNavigate } from "@tanstack/react-router";
import { Package, ShoppingCart } from "lucide-react";
import { useCart } from "../state/cart";

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="/assets/generated/gadgetmart-logo.dim_512x512.png"
            alt="GadgetMart"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-foreground">GadgetMart</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Deals
          </Link>
          <Link
            to="/orders"
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            data-ocid="nav.link"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </Link>
          <button
            type="button"
            onClick={() => navigate({ to: "/cart" })}
            className="relative px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            data-ocid="nav.button"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="hidden sm:inline">Cart</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
