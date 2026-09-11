import { authService } from "./authService";

const API_URL = `${import.meta.env.REACT_APP_API_URL}/books`;

export const getBooks = async () => {
  const response = await fetch(API_URL, {
    headers: authService.getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const result = await response.json();

  return result.data;
};
export const getBookById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: authService.getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch book");
  }

  return result.data;
};
export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authService.getHeaders(),
    body: JSON.stringify(bookData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update book");
  }

  return result.data;
};

export const createBook = async (bookData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authService.getHeaders(),
    body: JSON.stringify(bookData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create book");
  }

  return result.data;
};

export const getNewBooks = async () => {
  const response = await fetch(`${API_URL}/new`, {
    headers: authService.getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch new books");
  }

  const result = await response.json();

  return result.data;
};
export const deleteBook = async (bookId) => {
  const response = await fetch(`${API_URL}/${bookId}`, {
    method: "DELETE",
    headers: authService.getHeaders(),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete book");
  }

  return await response.json();
};
export const getBestsellers = async () => {
  const response = await fetch(`${API_URL}/bestsellers`, {
    headers: authService.getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch bestsellers");
  }

  return result.data;
};

export const getBestsellersUnder200 = async () => {
  const response = await fetch(`${API_URL}/bestsellers?maxPrice=200`, {
    headers: authService.getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch books under ₹200");
  }

  return result.data;
};
