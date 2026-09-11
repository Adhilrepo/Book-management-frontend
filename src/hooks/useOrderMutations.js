import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../service/orderService";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
