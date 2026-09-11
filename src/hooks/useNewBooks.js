import { useQuery } from "@tanstack/react-query";
import { getNewBooks } from "../service/bookService";

export const useNewBooks = () =>
  useQuery({
    queryKey: ["newBooks"],
    queryFn: getNewBooks,
  });
