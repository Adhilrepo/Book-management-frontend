import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user data:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setError(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
