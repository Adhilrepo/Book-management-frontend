import BookCard from "../components/BookCard";
import { useNewBooks } from "../hooks/useNewBooks";
import "../styles/NewReleasePage.css";

export const NewReleasePage = () => {
  const { data: books = [], isLoading: loading, error } = useNewBooks();

  if (loading) {
    return <h2>Loading new books...</h2>;
  }

  if (error) {
    return <h2>{error.message || "Failed to load new books"}</h2>;
  }

  return (
    <div className="new-release-page">
      <h1 className="new-release-title">New Release Books</h1>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};
