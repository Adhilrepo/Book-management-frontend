import { useState } from "react";
import BookCard from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";
import "../styles/BooksPage.css";

export const BooksPage = () => {
  const { data: books = [], isLoading: loading, error } = useBooks();
  const [search, setSearch] = useState("");

  const filteredBooks = books.filter((book) => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return true;
    }

    return [book.title, book.author, book.isbn]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchTerm));
  });

  if (loading) {
    return (
      <div className="books-page-container">
        <div className="books-page-empty">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="books-page-container">
      <h1 className="books-page-title">📚 Books</h1>

      <input
        type="search"
        className="books-page-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search books by title, author, or ISBN..."
        aria-label="Search books by title, author, or ISBN"
      />

      {error && (
        <div className="books-page-error">
          {error?.message || "Something went wrong"}
        </div>
      )}

      {books.length === 0 ? (
        <div className="books-page-empty">
          <p>No books available.</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="books-page-empty">
          <p>No books match your search.</p>
        </div>
      ) : (
        <div className="books-page-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book._id || book.title} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
