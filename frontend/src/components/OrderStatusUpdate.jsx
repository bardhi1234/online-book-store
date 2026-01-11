import { useState } from "react";

function OrderStatusUpdate({ order, token, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const BASE_URL = "http://localhost:5000/api";

  // Ngjyra për secilin status
  const statusColors = {
    pending: "#f39c12",   // portokalli
    paid: "#2ecc71",      // jeshile
    shipped: "#3498db",   // blu
    cancelled: "#e74c3c", // e kuqe
  };

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await fetch(`${BASE_URL}/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update status");
        setStatus(order.status); // rikthen statusin e vjetër
      } else {
        onStatusChange(order.id, newStatus);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
      setStatus(order.status); // rikthen statusin e vjetër
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      style={{
        ...styles.select,
        backgroundColor: statusColors[status] || "#ccc",
        color: "#fff",
      }}
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="shipped">Shipped</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

const styles = {
  select: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default OrderStatusUpdate;
