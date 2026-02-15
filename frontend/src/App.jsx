import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Books from "./pages/Books";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #21c0e7ff" }}>
        <Link to="/" style={{ marginRight: 10 }}>Books</Link>
        <Link to="/orders" style={{ marginRight: 10 }}>Orders</Link>
        <Link to="/admin/users">Admin Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
