import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../service/authService";
import "../styles/FormPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.token && response.user) {
        login(response.user, response.token);

        // Redirect based on role
        if (response.user.role === "admin") {
          navigate("/books");
        } else {
          navigate("/books");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container auth-form-container">
      <h1 className="form-page-title auth-form-title">Login</h1>

      {error && <div className="form-page-error">{error}</div>}

      <form className="form-page-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-page-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-page-input"
          required
        />
        <button type="submit" className="auth-form-submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="auth-form-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}
