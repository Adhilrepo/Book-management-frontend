import { authService } from "./authService";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

// Get logged-in user profile
export const getProfile = async () => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: authService.getHeaders(),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return data;
};

// Save user's address
export const updateAddress = async (address) => {
  const response = await fetch(`${API_URL}/address`, {
    method: "PUT",
    headers: authService.getHeaders(),
    body: JSON.stringify(address),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update address");
  }

  return data;
};
