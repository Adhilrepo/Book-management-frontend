import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../service/bookService";

export const useBook = (id) =>
  useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    enabled: Boolean(id),
  });
