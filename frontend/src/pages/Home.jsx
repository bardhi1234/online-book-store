// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Online Book Store</h1>
      <p>Click the link below to see Orders:</p>
      <Link to="/orders">Go to Orders Page</Link>
    </div>
  );
}
