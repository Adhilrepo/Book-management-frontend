import { Link } from "react-router-dom";
import "../styles/ForbiddenPage.css";

export default function ForbiddenPage() {
  return (
    <div className="forbidden-page">
      <h1 className="forbidden-heading">403</h1>
      <p className="forbidden-text">Access Denied</p>
      <p className="forbidden-description">
        You don't have permission to access this page. Please contact an
        administrator.
      </p>
      <Link to="/books" className="forbidden-link">
        Go to Books
      </Link>
    </div>
  );
}
