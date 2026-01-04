import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/books");
      const data = await res.json();

      if (!res.ok) {
        setError("Failed to fetch books");
        setLoading(false);
        return;
      }

      setBooks(data);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Books 📚</h1>

      {user && (
        <>
          <p>
            Welcome <strong>{user.name}</strong>
          </p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </>
      )}

      <button onClick={logout}>Logout</button>

      <hr />

      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && books.length === 0 && <p>No books found</p>}

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> – {book.author} – €{book.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
