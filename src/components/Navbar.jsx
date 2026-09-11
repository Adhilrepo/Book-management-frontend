import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <h2 className="navbar-logo">📚 Book Management</h2>
      </Link>

      {isAuthenticated ? (
        <div className="navbar-authenticated">
          <div className="nav-links">
            <NavLink
              to="/bestsellers"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              🏆 Bestsellers
            </NavLink>

            <NavLink
              to="/new-releases"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              🆕 New Releases
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              📖 Books
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin/books"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                🛠️ Manage Books
              </NavLink>
            )}
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              � Orders
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              👤 Profile
            </NavLink>
          </div>

          <div className="navbar-user-info">
            <button className="navbar-logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="navbar-public-links">
          <Link to="/login" className="navbar-public-link">
            Login
          </Link>
          <Link to="/register" className="navbar-public-link">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
