import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBookMutation } from "../hooks/useBookMutations";
import "../styles/FormPages.css";

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    year: new Date().getFullYear(),
    rating: 5,
    image: "",
    description: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const createBookMutation = useCreateBookMutation();
  const loading = createBookMutation.isPending;

  const handleChange = (e) => {
    setFormData({
      ...formData,
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
      await createBookMutation.mutateAsync(formData);
      navigate("/books");
    } catch (err) {
      setError(err.message || "Failed to add book. Please try again.");
    }
  };

  return (
    <div className="form-page-container">
      <h1 className="form-page-title">Add New Book</h1>

      {error && <div className="form-page-error">{error}</div>}

      <form className="form-page-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
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
          value={formData.rating}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="form-page-input"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="form-page-input form-page-textarea"
        />

        <div className="form-page-button-group">
          <button type="submit" className="form-page-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </button>
          <button
            type="button"
            className="form-page-cancel"
            onClick={() => navigate("/books")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
