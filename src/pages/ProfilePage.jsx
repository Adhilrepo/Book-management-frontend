import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: orders = [], isLoading: loading } = useOrders();

  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">User Profile</h1>

      {/* Name */}
      <div className="profile-page-section">
        <div className="profile-page-label">Name</div>

        <div className="profile-page-value">{user?.name || "N/A"}</div>
      </div>

      {/* Email */}
      <div className="profile-page-section">
        <div className="profile-page-label">Email</div>

        <div className="profile-page-value">{user?.email || "N/A"}</div>
      </div>

      {/* Member Since */}
      <div className="profile-page-section">
        <div className="profile-page-label">Member Since</div>

        <div className="profile-page-value">
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </div>

      {/* Purchase History */}
      <div className="profile-page-section">
        <div className="profile-page-label">Purchasing History</div>

        {loading ? (
          <p>Loading purchases...</p>
        ) : orders.length === 0 ? (
          <p className="profile-page-value">No purchases yet.</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order._id} className="profile-order-card">
                <h3 className="profile-order-title">
                  {order.book?.title || "Book"}
                </h3>

                <p>Author: {order.book?.author || "N/A"}</p>

                <p>Quantity: {order.quantity}</p>

                <p>Total: ₹{order.total}</p>

                <p>
                  Status: <strong>{order.status}</strong>
                </p>

                <p>
                  Purchased: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
