import { createOrder } from "../api/ordersApi";

export default function OrderForm({ token }) {
  const items = [
    { bookId: 20, quantity: 1, price: 20 },
    { bookId: 22, quantity: 1, price: 15 },
  ];

  const handleSubmit = async () => {
    try {
      const res = await createOrder(items, token);
      alert(`Order created: ${res.orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Create Order</h2>
      <button onClick={handleSubmit}>Submit Order</button>
    </div>
  );
}
