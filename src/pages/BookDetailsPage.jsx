import { useParams, useNavigate } from "react-router-dom";
import { useBook } from "../hooks/useBook";
import "../styles/BookDetailsPage.css";

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading: loading, error: queryError } = useBook(id);
  const displayError = queryError?.message;

  if (loading) {
    return <div className="book-details-loading">Loading...</div>;
  }

  console.log(book);
  if (displayError && !book) {
    return (
      <div className="book-details-container">
        <div className="book-details-error">{displayError}</div>
        <button
          className="book-details-back-button"
          onClick={() => navigate("/books")}
        >
          ← Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      {displayError && <div className="book-details-error">{displayError}</div>}

      {book && (
        <>
          <div className="book-details-header">
            <img
              src={book.coverImage || "/default-book-cover.jpg"}
              alt={book.title}
              className="book-details-image"
            />
            <div className="book-details-content">
              <h1 className="book-details-title">{book.title}</h1>
              <div className="book-details-meta">
                <div className="book-details-meta-item">
                  <span className="book-details-meta-label">Author:</span>{" "}
                  {book.author}
                </div>
                <div className="book-details-meta-item">
                  <span className="book-details-meta-label">Category:</span>{" "}
                  {book.category}
                </div>
                <div className="book-details-meta-item">
                  <span className="book-details-meta-label">Year:</span>{" "}
                  {book.year}
                </div>
                <div className="book-details-meta-item">
                  <span className="book-details-meta-label">Rating:</span> ★{" "}
                  {book.rating}
                </div>
              </div>

              <div className="book-details-description">
                <span className="book-details-meta-label">Description:</span>
                <p>{book.description || "No description available"}</p>
              </div>

              <div className="book-details-button-group">
                <button
                  className="book-details-back-button"
                  onClick={() => navigate("/books")}
                >
                  ← Back to Books
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
