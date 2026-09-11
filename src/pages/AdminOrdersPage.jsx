import { useAdminOrders } from "../hooks/useAdminOrders";

const AdminOrdersPage = () => {
  const { data, isLoading, isError, error } = useAdminOrders();

  if (isLoading) {
    return <h2>Loading orders...</h2>;
  }

  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }

  const orders = data?.orders || [];

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Orders</h1>

      <p>Total Orders: {orders.length}</p>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3>Order ID: {order._id}</h3>

              <p>
                <strong>Customer:</strong> {order.user?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong> {order.user?.email || "Unknown"}
              </p>

              <p>
                <strong>Book:</strong> {order.book?.title || "Unknown"}
              </p>

              <p>
                <strong>Author:</strong> {order.book?.author || "Unknown"}
              </p>

              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>

              <p>
                <strong>Total:</strong> ₹{order.total}
              </p>

              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
