import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useBulkAddProducts, useGetProducts } from "../hooks/useQueries";

type SortOption = "price-asc" | "price-desc" | "name";
type CategoryFilter = "all" | "phones" | "laptops" | "accessories";

export default function CatalogPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const bulkAdd = useBulkAddProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [isSeeded, setIsSeeded] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isSeeding && products.length === 0 && !isLoading && !isSeeded) {
      seedProducts();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: seedProducts is stable
  }, [products, isLoading, isSeeded, isSeeding]);

  const seedProducts = async () => {
    if (isSeeding) return;
    setIsSeeding(true);

    const seedData: Array<[string, string, bigint, bigint]> = [
      [
        "iPhone 20 Pro Max",
        'Latest Apple flagship with titanium design, A18 chip, 48MP ProRAW camera, USB-C, 6.9" Super Retina XDR display',
        BigInt(2001),
        BigInt(10),
      ],
      [
        "iPhone 13 Pro Max",
        'Premium flagship smartphone with A15 Bionic chip, 6.7" Super Retina XDR display, Pro camera system',
        BigInt(150),
        BigInt(25),
      ],
      [
        "Samsung Galaxy S22 Ultra",
        'Flagship Android phone with S Pen, 108MP camera, 6.8" Dynamic AMOLED display',
        BigInt(175),
        BigInt(18),
      ],
      [
        "MacBook Air M2",
        'Ultra-thin laptop with Apple M2 chip, 13.6" Liquid Retina display, all-day battery life',
        BigInt(299),
        BigInt(12),
      ],
      [
        "Dell XPS 15",
        'Premium Windows laptop with Intel i7, 15.6" 4K display, NVIDIA graphics',
        BigInt(275),
        BigInt(15),
      ],
      [
        "AirPods Pro 2nd Gen",
        "Active noise cancellation, spatial audio, wireless charging case",
        BigInt(45),
        BigInt(50),
      ],
      [
        "Sony WH-1000XM5",
        "Industry-leading noise canceling headphones, 30-hour battery life",
        BigInt(65),
        BigInt(30),
      ],
      [
        'iPad Pro 12.9"',
        "Powerful tablet with M2 chip, Liquid Retina XDR display, Apple Pencil support",
        BigInt(225),
        BigInt(20),
      ],
      [
        "Samsung Galaxy Tab S8+",
        'Premium Android tablet with S Pen, 12.4" AMOLED display',
        BigInt(195),
        BigInt(22),
      ],
      [
        "Apple Watch Series 8",
        "Advanced health and fitness tracking, always-on Retina display",
        BigInt(85),
        BigInt(35),
      ],
      [
        "Logitech MX Master 3S",
        "Premium wireless mouse with ultra-fast scrolling, ergonomic design",
        BigInt(25),
        BigInt(60),
      ],
      [
        "Razer BlackWidow V3",
        "Mechanical gaming keyboard with RGB lighting, green switches",
        BigInt(35),
        BigInt(40),
      ],
      [
        "Google Pixel 7 Pro",
        "Google flagship with Tensor G2 chip, amazing camera, pure Android",
        BigInt(165),
        BigInt(28),
      ],
      [
        "Realme Buds Air 5",
        "True wireless earbuds with 50dB ANC, 10mm driver, 38hr battery life",
        BigInt(299),
        BigInt(40),
      ],
      [
        "Boat Rockerz 450",
        "Wireless Bluetooth headphones, 15hr battery, padded ear cushions",
        BigInt(499),
        BigInt(35),
      ],
      [
        "Redmi Note 13 Pro",
        '200MP camera smartphone, 5G, 6.67" AMOLED display, 5000mAh battery',
        BigInt(1199),
        BigInt(20),
      ],
    ];

    try {
      await bulkAdd.mutateAsync(seedData);
      setIsSeeded(true);
    } catch (error) {
      console.error("Failed to seed products:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((p) => {
        const name = p.name.toLowerCase();
        switch (category) {
          case "phones":
            return (
              name.includes("iphone") ||
              name.includes("galaxy") ||
              name.includes("pixel") ||
              name.includes("redmi") ||
              name.includes("realme")
            );
          case "laptops":
            return (
              name.includes("macbook") ||
              name.includes("laptop") ||
              name.includes("dell") ||
              name.includes("xps")
            );
          case "accessories":
            return (
              name.includes("airpods") ||
              name.includes("watch") ||
              name.includes("mouse") ||
              name.includes("keyboard") ||
              name.includes("headphone") ||
              name.includes("buds") ||
              name.includes("boat") ||
              name.includes("rockerz")
            );
          default:
            return true;
        }
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchQuery, sortBy, category]);

  if (isLoading || isSeeding) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="catalog.loading_state"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border border-border">
        <img
          src="/assets/generated/gadget-deals-hero.dim_1600x600.png"
          alt="Gadget Deals"
          className="w-full h-48 md:h-64 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Unbelievable Gadget Deals
            </h1>
            <p className="text-muted-foreground text-lg">
              Premium tech at prices you won&apos;t believe. Limited stock!
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="catalog.search_input"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                className="pl-10 pr-8 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                data-ocid="catalog.select"
              >
                <option value="all">All Categories</option>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              data-ocid="catalog.select"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedProducts.length}{" "}
        {filteredAndSortedProducts.length === 1 ? "deal" : "deals"}
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12" data-ocid="catalog.empty_state">
          <p className="text-muted-foreground text-lg">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-ocid="catalog.list"
        >
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id.toString()} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
