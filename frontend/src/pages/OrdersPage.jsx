import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrdersPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:5000/api";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/");
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
      fetchOrders();
    } catch {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate, token]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await fetch(`${BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>📦 Orders</h1>
          <p style={styles.subtitle}>Manage and review all orders</p>
        </div>

        <div style={styles.userBox}>
          <div>
            <strong>{user?.name}</strong>
            <div style={styles.role}>{user?.role}</div>
          </div>
          <button onClick={logout} style={styles.logout}>
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      {loading && <p style={styles.loading}>Loading orders...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {orders.map((order) => (
          <div key={order.id} style={styles.card}>
            {/* CARD HEADER */}
            <div style={styles.cardHeader}>
              <h3>Order #{order.id}</h3>
              <span style={styles.badge}>✅ Confirmed</span>
            </div>

            <p style={styles.userLine}>
              👤{" "}
              {user?.role === "admin"
                ? order.user_name || `User ID ${order.user_id}`
                : user?.name}
            </p>

            <div style={styles.meta}>
              <span>🧾 {new Date(order.created_at).toLocaleString()}</span>
              <span style={styles.total}>€ {order.total}</span>
            </div>

            <hr style={styles.hr} />

            {/* ITEMS */}
            <div>
              <strong>Items</strong>
              <ul style={styles.items}>
                {order.items?.map((item) => (
                  <li key={item.book_id} style={styles.item}>
                    <span>{item.title}</span>
                    <span>
                      x{item.quantity} · €{item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ADMIN DELETE */}
            {user?.role === "admin" && (
              <button
                onClick={() => deleteOrder(order.id)}
                style={styles.delete}
              >
                🗑️ Delete Order
              </button>
            )}
          </div>
        ))}
      </div>

      <footer style={styles.footer}>
        © 2026 MyBookStore — All rights reserved
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  title: { fontSize: "36px", margin: 0 },
  subtitle: { opacity: 0.8 },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  role: { fontSize: "0.85em", opacity: 0.7 },

  logout: {
    background: "#e74c3c",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
    gap: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "20px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    background: "rgba(46,204,113,0.2)",
    color: "#2ecc71",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.85em",
    fontWeight: "600",
  },

  userLine: { marginTop: "10px", opacity: 0.85 },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "0.9em",
    opacity: 0.85,
  },

  total: { fontWeight: "700", fontSize: "1.1em" },

  hr: {
    border: "none",
    height: "1px",
    background: "rgba(255,255,255,0.2)",
    margin: "15px 0",
  },

  items: { listStyle: "none", padding: 0, marginTop: "10px" },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px dashed rgba(255,255,255,0.2)",
    fontSize: "0.9em",
  },

  delete: {
    marginTop: "15px",
    width: "100%",
    background: "#e74c3c",
    border: "none",
    padding: "10px",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: { textAlign: "center", fontSize: "18px" },
  error: { color: "#ffcccc", textAlign: "center" },

  footer: {
    marginTop: "50px",
    textAlign: "center",
    opacity: 0.6,
    fontSize: "0.9em",
  },
};

export default OrdersPage;
