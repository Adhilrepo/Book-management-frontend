import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/HomePage.css";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="home-page-content">
        <h1 className="home-page-title">📚 Book Management</h1>
        <h2 className="home-page-subtitle">
          Discover and Manage Your Favorite Books
        </h2>
        <p className="home-page-description">
          A powerful platform to explore, organize, and manage your personal
          book collection. Sign in to get started or create a new account today.
        </p>

        <div className="home-page-button-group">
          {isAuthenticated ? (
            <Link to="/books" className="home-page-primary-button">
              Browse Books
            </Link>
          ) : (
            <>
              <Link to="/login" className="home-page-primary-button">
                Sign In
              </Link>
              <Link to="/register" className="home-page-secondary-button">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
