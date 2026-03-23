import { Link } from "@tanstack/react-router";
import { ExternalLink, ShoppingCart } from "lucide-react";
import type { Product } from "../backend";
import { formatPrice } from "../lib/format";
import {
  getAmazonSearchUrl,
  getFlipkartSearchUrl,
  openMarketplace,
} from "../lib/marketplace";
import { getProductImage } from "../lib/productImage";
import { useCart } from "../state/cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const originalPrice = Number(product.price) * 8;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleFlipkartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMarketplace(getFlipkartSearchUrl(product.name));
  };

  const handleAmazonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMarketplace(getAmazonSearchUrl(product.name));
  };

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id.toString() }}
      className="group block"
      data-ocid="catalog.item.1"
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full flex flex-col">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={getProductImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-bold">
            DEAL
          </div>
          {Number(product.stock) < 10 && Number(product.stock) > 0 && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-bold">
              Only {product.stock.toString()} left!
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(Number(product.price))}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Save {formatPrice(originalPrice - Number(product.price))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 p-2.5 rounded-lg transition-colors"
                aria-label="Add to cart"
                data-ocid="catalog.primary_button"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>

            {/* Marketplace Links */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleFlipkartClick}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs border border-border rounded hover:bg-muted hover:border-primary/50 transition-all"
                aria-label="View on Flipkart"
                data-ocid="catalog.secondary_button"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Flipkart</span>
              </button>
              <button
                type="button"
                onClick={handleAmazonClick}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs border border-border rounded hover:bg-muted hover:border-primary/50 transition-all"
                aria-label="View on Amazon"
                data-ocid="catalog.secondary_button"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Amazon</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
