const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

// Create an order from checkout details.
export const createOrder = async (orderDetails) => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderDetails),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Purchase failed");
  }

  return data;
};

// Get logged-in user's purchase history
export const getMyOrders = async () => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");

  const response = await fetch(`${API_URL}/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch purchase history");
  }

  return data.orders || [];
};

export const getOrders = getMyOrders;

// Get ALL orders - Admin
export const getAllOrders = async () => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");

  const response = await fetch(`${API_URL}/all-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch all orders");
  }

  return data;
};
