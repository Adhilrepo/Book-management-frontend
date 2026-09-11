import BookCard from "../components/BookCard";
import {
  useBestsellers,
  useBestsellersUnder200,
} from "../hooks/useBestsellers";
import "../styles/BestsellerPage.css";

export default function BestsellerPage() {
  const {
    data: bestsellers = [],
    isLoading: bestsellersLoading,
    error: bestsellersError,
  } = useBestsellers();
  const {
    data: under200 = [],
    isLoading: under200Loading,
    error: under200Error,
  } = useBestsellersUnder200();

  if (bestsellersLoading || under200Loading) {
    return <h2>Loading bestsellers...</h2>;
  }

  if (bestsellersError || under200Error) {
    return <h2>Failed to load bestsellers</h2>;
  }

  return (
    <main className="bestseller-page">
      {/* Best Sellers */}
      <section className="bestseller-section bestseller-section-spaced">
        <div className="bestseller-section-header">
          <div>
            <h2 className="bestseller-section-title">🔥 Best Sellers</h2>

            <p className="bestseller-section-subtitle">
              Most popular books right now
            </p>
          </div>
        </div>

        <div className="book-grid">
          {bestsellers.slice(0, 10).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      {/* Under ₹200 */}
      {under200.length > 0 && (
        <section>
          <div className="bestseller-section-header">
            <div>
              <h2 className="bestseller-section-title">
                💰 Bestsellers Under ₹200
              </h2>

              <p className="bestseller-section-subtitle">
                Popular books at an affordable price
              </p>
            </div>
          </div>

          <div className="book-grid">
            {under200.slice(0, 10).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
