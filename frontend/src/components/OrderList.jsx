import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/ordersApi";

export default function OrderList({ token, isAdmin }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders(token);
      setOrders(data);
    };
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, token);
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Orders List</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div
          key={o.id}
          style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}
        >
          <div>
            Order #{o.id} | Total: {o.total} | Status: {o.status}
          </div>
          <div>Items: {o.items.map((i) => `${i.book_id} x ${i.quantity}`).join(", ")}</div>
          {isAdmin && (
            <select
              value={o.status}
              onChange={(e) => handleStatusChange(o.id, e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
              <option value="cancelled">cancelled</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
