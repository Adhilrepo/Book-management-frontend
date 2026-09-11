import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProtectedRoute, AdminRoute } from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { BooksPage } from "../pages/BooksPage";
import BookDetailsPage from "../pages/BookDetailsPage";
import AddBookPage from "../pages/AddBookPage";
import EditBookPage from "../pages/EditBookPage";
import ProfilePage from "../pages/ProfilePage";
import ForbiddenPage from "../pages/ForbiddenPage";
import { NewReleasePage } from "../pages/NewReleasePage";
import BestsellerPage from "../pages/BestsellerPage";
import CheckoutPage from "../pages/CheckOutPage";
import AdminBooksPage from "../pages/AdminBooksPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import "../styles/AppRoutes.css";

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes - Authenticated Users */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-releases"
          element={
            <ProtectedRoute>
              <NewReleasePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bestsellers"
          element={
            <ProtectedRoute>
              <BestsellerPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <AdminBooksPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books/add"
          element={
            <AdminRoute>
              <AddBookPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books/edit/:id"
          element={
            <AdminRoute>
              <EditBookPage />
            </AdminRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route
          path="*"
          element={<h1 className="route-not-found">404 Not Found</h1>}
        />
      </Routes>
    </>
  );
}
