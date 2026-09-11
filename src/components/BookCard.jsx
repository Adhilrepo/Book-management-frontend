import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/BookCard.css";
function BookCard({ book }) {
  const {
    title,
    author,
    category,
    publicationYear,
    rating,
    coverImage,
    price,
    quantity,
    _id,
  } = book;

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isOutOfStock = Number(quantity || 0) === 0;

  // View book details
  const handleView = () => {
    navigate(`/books/${_id}`);
  };

  // Buy / Add book to checkout
  const handleBuy = () => {
    if (isOutOfStock) {
      alert("This book is currently out of stock.");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    // Books already selected in checkout
    const existingBooks = location.state?.selectedBooks || [];

    // Prevent adding the same book twice
    const alreadyAdded = existingBooks.some((item) => item._id === book._id);

    if (alreadyAdded) {
      alert("This book is already added to your order.");
      return;
    }

    // Add the new book
    const updatedBooks = [
      ...existingBooks,
      {
        ...book,
        quantity: 1,
      },
    ];

    navigate("/checkout", {
      state: {
        books: updatedBooks,
      },
    });
  };

  return (
    <article className="book-card">
      {/* Cover */}
      <div className="book-card-cover">
        {coverImage ? (
          <img src={coverImage} alt={title} className="book-card-image" />
        ) : (
          <span className="book-card-no-cover">No Cover Image</span>
        )}
      </div>

      {/* Content */}
      <div className="book-card-content">
        <h3 className="book-card-title">{title}</h3>

        <p className="book-card-author">by {author}</p>

        <p className="book-card-meta">Category: {category || "N/A"}</p>

        <p className="book-card-meta">Published: {publicationYear || "N/A"}</p>

        <p className="book-card-rating">★ {rating || 0}</p>

        {/* Price */}
        <div className="book-card-price">₹{Number(price || 0).toFixed(2)}</div>

        {/* Stock */}
        <p
          className={`book-card-stock ${isOutOfStock ? "out-of-stock" : "in-stock"}`}
        >
          {isOutOfStock ? "Out of stock" : `${quantity} available`}
        </p>

        {/* Buttons */}
        <div className="book-card-actions">
          <button
            type="button"
            onClick={handleView}
            className="book-card-view-button"
          >
            View
          </button>

          <button
            type="button"
            onClick={handleBuy}
            disabled={isOutOfStock}
            className="book-card-buy-button"
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
