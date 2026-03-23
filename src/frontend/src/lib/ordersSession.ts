const SESSION_KEY = "gadgetmart_session_orders";

export function saveOrderToSession(orderId: bigint): void {
  const orders = getSessionOrders();
  orders.push(orderId);
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(orders.map((id) => id.toString())),
  );
}

export function getSessionOrders(): bigint[] {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as string[];
    return parsed.map((id) => BigInt(id));
  } catch {
    return [];
  }
}
