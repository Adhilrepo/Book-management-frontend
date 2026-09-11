import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../service/orderService";

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: getAllOrders,
    staleTime: 5 * 60 * 1000,
  });
};
