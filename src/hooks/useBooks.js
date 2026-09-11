import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../service/bookService";

export const useBooks = () =>
  useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
