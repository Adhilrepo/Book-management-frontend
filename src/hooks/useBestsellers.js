import { useQuery } from "@tanstack/react-query";
import { getBestsellers, getBestsellersUnder200 } from "../service/bookService";

export const useBestsellers = () =>
  useQuery({
    queryKey: ["bestsellers"],
    queryFn: getBestsellers,
  });

export const useBestsellersUnder200 = () =>
  useQuery({
    queryKey: ["bestsellers", "under200"],
    queryFn: getBestsellersUnder200,
  });
