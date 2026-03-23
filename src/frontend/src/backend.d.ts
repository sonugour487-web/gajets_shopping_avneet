import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Order {
    id: bigint;
    deliveryCharge: bigint;
    paymentMethod: string;
    productIds: Array<bigint>;
    deliveryDate: string;
    totalAmount: bigint;
    timestamp: Time;
    buyer: Principal;
    phone: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    price: bigint;
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, stock: bigint): Promise<bigint>;
    bulkAddProducts(newProducts: Array<[string, string, bigint, bigint]>): Promise<Array<bigint>>;
    createOrder(productIds: Array<bigint>, phone: string, paymentMethod: string, deliveryCharge: bigint, deliveryDate: string): Promise<bigint>;
    getOrder(id: bigint): Promise<Order | null>;
    getOrdersByBuyer(buyer: Principal): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
}
