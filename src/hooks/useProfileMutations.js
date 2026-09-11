import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "../service/userService";

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
