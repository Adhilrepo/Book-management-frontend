import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBook } from "../hooks/useBook";
import { useUpdateBookMutation } from "../hooks/useBookMutations";
import "../styles/FormPages.css";
export default function EditBookPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { data: book, isLoading: loading, error: queryError } = useBook(id);
  const updateBookMutation = useUpdateBookMutation();
  const updating = updateBookMutation.isPending;

  const handleChange = (e) => {
    setFormData({
      ...(formData || book),
      [e.target.name]:
        e.target.name === "year" || e.target.name === "rating"
          ? parseInt(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await updateBookMutation.mutateAsync({ id, data: formData || book });

      navigate(`/books/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update book.");
    }
  };

  if (loading) {
    return <div className="form-page-loading">Loading...</div>;
  }

  if (queryError) {
    return <div className="form-page-error">{queryError.message}</div>;
  }

  return (
    <div className="form-page-container">
      <h1 className="form-page-title">Edit Book</h1>

      {error && <div className="form-page-error">{error}</div>}

      <form className="form-page-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData?.title || book.title}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData?.author || book.author}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData?.category || book.category}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData?.year ?? book.year}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-10)"
          min="0"
          max="10"
          step="0.1"
          value={formData?.rating ?? book.rating}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData?.image || book.image}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData?.description || book.description}
          onChange={handleChange}
          className="form-page-input form-page-textarea"
        />

        <div className="form-page-button-group">
          <button
            type="submit"
            className="form-page-submit"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Book"}
          </button>
          <button
            type="button"
            className="form-page-cancel"
            onClick={() => navigate(`/books/${id}`)}
            disabled={updating}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
