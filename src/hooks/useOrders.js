import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../service/orderService";

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
