import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../service/userService";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
