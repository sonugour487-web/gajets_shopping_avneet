import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import ReviewsSection from "../components/ReviewsSection";
import SpecsList from "../components/SpecsList";
import { useGetProduct } from "../hooks/useQueries";
import { formatPrice } from "../lib/format";
import {
  getAmazonSearchUrl,
  getFlipkartSearchUrl,
  openMarketplace,
} from "../lib/marketplace";
import { getProductImage } from "../lib/productImage";
import { useCart } from "../state/cart";

function getPriceMultiplier(seed: bigint, min: number, max: number): number {
  const n = Number(seed % BigInt(1000));
  return min + (n / 1000) * (max - min);
}

export default function ProductDetailsPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="product.loading_state"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12" data-ocid="product.error_state">
        <p className="text-muted-foreground text-lg mb-4">Product not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline"
          data-ocid="product.link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
      </div>
    );
  }

  const originalPrice = Number(product.price) * 8;
  const savings = originalPrice - Number(product.price);
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  const flipkartMultiplier = getPriceMultiplier(product.id, 1.15, 1.25);
  const amazonMultiplier = getPriceMultiplier(
    product.id + BigInt(7),
    1.18,
    1.3,
  );
  const flipkartPrice = Math.round(Number(product.price) * flipkartMultiplier);
  const amazonPrice = Math.round(Number(product.price) * amazonMultiplier);

  const specs: Record<string, string> = {
    "Product ID": product.id.toString(),
    Category:
      product.name.toLowerCase().includes("iphone") ||
      product.name.toLowerCase().includes("galaxy") ||
      product.name.toLowerCase().includes("pixel") ||
      product.name.toLowerCase().includes("redmi")
        ? "Phones"
        : product.name.toLowerCase().includes("macbook") ||
            product.name.toLowerCase().includes("laptop")
          ? "Laptops"
          : "Accessories",
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate({ to: "/cart" });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="product.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to deals
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="relative aspect-square bg-muted">
            <img
              src={getProductImage(product.name)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-bold">
              {savingsPercent}% OFF
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(Number(product.price))}
              </span>
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold">
                Save {formatPrice(savings)}
              </span>
              <span className="text-muted-foreground">
                ({savingsPercent}% discount)
              </span>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Available – Delivery in 5–7 days
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              Quantity:
            </span>
            <div className="flex items-center border border-input rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-muted transition-colors"
                data-ocid="product.secondary_button"
              >
                -
              </button>
              <span className="px-6 py-2 border-x border-input font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-muted transition-colors"
                data-ocid="product.secondary_button"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button — always enabled */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            data-ocid="product.primary_button"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>

          {/* Price Comparison Table */}
          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Price Comparison
              </h3>
            </div>
            <div className="rounded-xl overflow-hidden border border-border">
              {/* Our App row */}
              <div className="flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🛒</span>
                  <div>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">
                      Gajets Shopping
                    </p>
                    <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded font-semibold">
                      BEST PRICE
                    </span>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  {formatPrice(Number(product.price))}
                </span>
              </div>

              {/* Flipkart row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🟡</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Flipkart
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{Math.round((flipkartMultiplier - 1) * 100)}% higher
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(flipkartPrice)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openMarketplace(getFlipkartSearchUrl(product.name))
                    }
                    className="text-xs text-primary hover:underline flex items-center gap-1 ml-auto"
                    data-ocid="product.secondary_button"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Amazon row */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🟠</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Amazon
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{Math.round((amazonMultiplier - 1) * 100)}% higher
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(amazonPrice)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openMarketplace(getAmazonSearchUrl(product.name))
                    }
                    className="text-xs text-primary hover:underline flex items-center gap-1 ml-auto"
                    data-ocid="product.secondary_button"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specs */}
          <SpecsList specs={specs} />
        </div>
      </div>

      {/* Customer Reviews */}
      <ReviewsSection productName={product.name} />
    </div>
  );
}
