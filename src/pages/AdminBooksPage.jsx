import { useState } from "react";
import { useBooks } from "../hooks/useBooks";
import {
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} from "../hooks/useBookMutations";
import "../styles/AdminBooksPage.css";

const emptyBook = {
  title: "",
  author: "",
  category: "",
  year: new Date().getFullYear(),
  rating: 5,
  image: "",
  description: "",
  price: "",
  quantity: "",
};

function AdminBooksPage() {
  const { data: books = [], isLoading, error } = useBooks();
  const createBookMutation = useCreateBookMutation();
  const updateBookMutation = useUpdateBookMutation();
  const deleteBookMutation = useDeleteBookMutation();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredBooks = books.filter((book) => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [book.title, book.author, book.isbn]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: ["year", "rating", "price", "quantity"].includes(name)
        ? value
        : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyBook);
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const payload = {
      ...form,
      year: Number(form.year),
      rating: Number(form.rating),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await updateBookMutation.mutateAsync({ id: editingId, data: payload });
      } else {
        await createBookMutation.mutateAsync(payload);
      }
      resetForm();
      setIsFormOpen(false);
    } catch (mutationError) {
      setFormError(mutationError.message || "Unable to save book");
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      ...emptyBook,
      ...book,
      image: book.image || book.coverImage || "",
      quantity: book.quantity ?? book.stock ?? "",
      price: book.price ?? "",
    });
    setIsFormOpen(true);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Are you sure you want to delete ${book.title}?`)) {
      return;
    }

    try {
      await deleteBookMutation.mutateAsync(book._id);
      if (editingId === book._id) {
        resetForm();
      }
    } catch (mutationError) {
      setFormError(mutationError.message || "Unable to delete book");
    }
  };

  const saving = createBookMutation.isPending || updateBookMutation.isPending;

  if (isLoading) {
    return (
      <main className="admin-books-page">
        <p>Loading books...</p>
      </main>
    );
  }

  return (
    <main className="admin-books-page">
      <header className="admin-books-header">
        <div>
          <p className="admin-books-eyebrow">Admin</p>
          <h1>Manage Books</h1>
          <p>Manage your catalogue, pricing, and available stock.</p>
        </div>
        <button
          type="button"
          className="admin-books-add-button"
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        >
          + Add Book
        </button>
      </header>

      {(error || formError) && (
        <div className="admin-books-error">{formError || error.message}</div>
      )}

      {isFormOpen && (
        <div className="admin-books-drawer-layer" role="presentation">
          <button
            type="button"
            className="admin-books-drawer-backdrop"
            aria-label="Close book form"
            onClick={() => setIsFormOpen(false)}
          />
          <aside className="admin-books-drawer" aria-label="Book form">
            <div className="admin-books-panel-heading">
              <h2>{editingId ? "Edit Book" : "Add Book"}</h2>
              <button
                type="button"
                className="admin-books-cancel"
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
              >
                Close
              </button>
            </div>
            <form className="admin-books-form" onSubmit={handleSubmit}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Author"
                required
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
              />
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="Published year"
              />
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
              />
              <input
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Stock"
                required
              />
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
              />
              <button
                type="submit"
                className="admin-books-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Book"}
              </button>
            </form>
          </aside>
        </div>
      )}

      <section className="admin-books-list-panel">
        <div className="admin-books-list-heading">
          <div>
            <h2>Catalogue</h2>
            <p className="admin-books-count">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author, or ISBN..."
            aria-label="Search books"
          />
        </div>

        <div className="admin-books-table-wrap">
          <table className="admin-books-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Book</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book._id}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Book">{book.title}</td>
                  <td data-label="Author">{book.author}</td>
                  <td data-label="Price">
                    ₹{Number(book.price || 0).toFixed(2)}
                  </td>
                  <td data-label="Stock">{book.quantity ?? book.stock ?? 0}</td>
                  <td data-label="Actions" className="admin-books-actions">
                    <button
                      type="button"
                      className="admin-books-edit"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-books-delete"
                      onClick={() => handleDelete(book)}
                      disabled={deleteBookMutation.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <p className="admin-books-empty">No books found.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminBooksPage;
