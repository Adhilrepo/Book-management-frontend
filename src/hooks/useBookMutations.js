import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook, deleteBook, updateBook } from "../service/bookService";

const invalidateBookQueries = (queryClient, bookId) => {
  queryClient.invalidateQueries({ queryKey: ["books"] });
  queryClient.invalidateQueries({ queryKey: ["bestsellers"] });
  queryClient.invalidateQueries({ queryKey: ["newBooks"] });

  if (bookId) {
    queryClient.invalidateQueries({ queryKey: ["book", bookId] });
  }
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => invalidateBookQueries(queryClient),
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBook(id, data),
    onSuccess: (_, variables) =>
      invalidateBookQueries(queryClient, variables.id),
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (_, bookId) => invalidateBookQueries(queryClient, bookId),
  });
};
