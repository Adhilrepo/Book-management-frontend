const API_URL = `${import.meta.env.REACT_APP_API_URL}/auth`;

export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  },

  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },

  getHeaders: () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};
