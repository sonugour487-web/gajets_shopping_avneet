export function getProductImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("iphone") || n.includes("i phone"))
    return "/assets/generated/iphone-20-pro-max.dim_600x600.png";
  if (n.includes("samsung") || n.includes("galaxy"))
    return "/assets/generated/samsung-galaxy.dim_600x600.png";
  if (n.includes("macbook") || n.includes("laptop") || n.includes("dell"))
    return "/assets/generated/macbook-laptop.dim_600x600.png";
  if (n.includes("airpods")) return "/assets/generated/airpods.dim_600x600.png";
  if (
    n.includes("headphone") ||
    n.includes("sony") ||
    n.includes("wh-") ||
    n.includes("rockerz") ||
    n.includes("boat")
  )
    return "/assets/generated/headphones.dim_600x600.png";
  if (n.includes("ipad") || n.includes("tablet"))
    return "/assets/generated/tablet-ipad.dim_600x600.png";
  if (n.includes("watch"))
    return "/assets/generated/smartwatch.dim_600x600.png";
  return "/assets/generated/gadget-default.dim_600x600.png";
}
