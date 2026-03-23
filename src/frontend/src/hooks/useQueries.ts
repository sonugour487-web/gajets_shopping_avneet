import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, Product } from "../backend";
import { useActor } from "./useActor";

export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

interface CreateOrderParams {
  productIds: bigint[];
  phone: string;
  paymentMethod: string;
  deliveryCharge: bigint;
  deliveryDate: string;
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateOrderParams) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createOrder(
        params.productIds,
        params.phone,
        params.paymentMethod,
        params.deliveryCharge,
        params.deliveryDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetOrder(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ["order", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useGetOrdersByBuyer(buyer: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ["orders", buyer?.toString()],
    queryFn: async () => {
      if (!actor || !buyer) return [];
      return actor.getOrdersByBuyer(buyer);
    },
    enabled: !!actor && !isFetching && !!buyer,
  });
}

export function useBulkAddProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (products: Array<[string, string, bigint, bigint]>) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.bulkAddProducts(products);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
