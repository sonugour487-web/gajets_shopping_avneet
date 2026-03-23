/**
 * Utility functions for generating marketplace search URLs
 */

/**
 * Checks if marketplace search is available for a given product name
 */
export function isMarketplaceSearchAvailable(
  productName: string | undefined,
): boolean {
  return !!productName && productName.trim().length > 0;
}

/**
 * Generates a Flipkart search URL for a product name
 */
export function getFlipkartSearchUrl(productName: string): string {
  const query = encodeURIComponent(productName.trim());
  return `https://www.flipkart.com/search?q=${query}`;
}

/**
 * Generates an Amazon search URL for a product name
 */
export function getAmazonSearchUrl(productName: string): string {
  const query = encodeURIComponent(productName.trim());
  return `https://www.amazon.in/s?k=${query}`;
}

/**
 * Opens a marketplace URL in a new tab
 */
export function openMarketplace(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
