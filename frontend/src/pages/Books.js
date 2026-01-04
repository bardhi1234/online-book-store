import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");

  const BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  // --- VERIFY USER & FETCH BOOKS ---
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.role) throw new Error("Invalid user");
      setUser(parsedUser);
    } catch (err) {
      console.error("Error parsing user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    fetchBooks();
  }, [navigate, token]);

  // --- FETCH BOOKS ---
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        setBooks([]);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch books");

      setBooks(data);
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // --- ADD BOOK (ADMIN ONLY) ---
  const addBook = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") return;

    try {
      const res = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add book");

      setTitle("");
      setAuthor("");
      setPrice("");
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- EDIT BOOK (ADMIN ONLY) ---
  const editBook = async (book) => {
    if (user?.role !== "admin") return;

    const newTitle = prompt("New Title:", book.title);
    const newAuthor = prompt("New Author:", book.author);
    const newPrice = prompt("New Price:", book.price || "");
    if (!newTitle || !newAuthor) return;

    try {
      const res = await fetch(`${BASE_URL}/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, author: newAuthor, price: newPrice }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update book");

      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- DELETE BOOK (ADMIN ONLY) ---
  const deleteBook = async (id) => {
    if (user?.role !== "admin") return;

    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete book");

      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>📚 MyBookStore</div>
        <nav style={styles.nav}>
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/books" style={styles.navLink}>Books</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </nav>
        <div style={styles.userInfo}>
          {user && <p><strong>{user.name}</strong> ({user.role})</p>}
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </header>

      {/* BOOKS */}
      {loading && <p style={styles.loading}>Loading books...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && books.length === 0 && <p style={styles.noBooks}>No books found</p>}

      <div style={styles.booksGrid}>
        {books.map((book) => (
          <div
            key={book.id}
            style={styles.bookCard}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.bookAuthor}>Author: {book.author}</p>
            {book.price && <p style={styles.bookPrice}>Price: €{book.price}</p>}

            {user?.role === "admin" && (
              <div style={styles.btnGroup}>
                <button style={styles.editBtn} onClick={() => editBook(book)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => deleteBook(book.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {user?.role === "admin" && (
        <div style={styles.addBookSection}>
          <h3>Add New Book</h3>
          <form onSubmit={addBook} style={styles.addForm}>
            <input style={styles.input} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input style={styles.input} type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            <input style={styles.input} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button type="submit" style={styles.addBtn}>Add Book</button>
          </form>
        </div>
      )}

      {/* ABOUT */}
      <section id="about" style={styles.aboutSection}>
        <h2>About MyBookStore</h2>
        <p>
          MyBookStore is a modern online book platform where you can browse, add, edit, and delete your favorite books.
          Built with React, modern design patterns, and secure authentication.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 MyBookStore. All rights reserved.</p>
        <p>Built with ❤️ by <strong>Bardh Dajaku</strong></p>
      </footer>
    </div>
  );
}

// --- STYLES ---
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: "20px", background: "linear-gradient(135deg, #667eea, #764ba2)", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 25px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(15px)", color: "#fff", marginBottom: "25px" },
  logo: { fontSize: "28px", fontWeight: "bold" },
  nav: { display: "flex", gap: "20px" },
  navLink: { color: "#fff", textDecoration: "none", fontWeight: "500", transition: "0.3s" },
  userInfo: { textAlign: "right" },
  logoutBtn: { backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", marginTop: "5px" },
  loading: { textAlign: "center", color: "#fff" },
  error: { color: "#ff6b6b", fontWeight: "bold", textAlign: "center" },
  noBooks: { textAlign: "center", color: "#fff" },
  booksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  bookCard: { background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)", padding: "15px", borderRadius: "12px", color: "#fff", transition: "transform 0.3s, box-shadow 0.3s", boxShadow: "0 6px 15px rgba(0,0,0,0.2)" },
  bookTitle: { marginBottom: "8px", fontWeight: "700" },
  bookAuthor: { marginBottom: "8px", color: "#dcdcdc" },
  bookPrice: { marginBottom: "8px", fontWeight: "bold" },
  btnGroup: { display: "flex", justifyContent: "space-between" },
  editBtn: { backgroundColor: "#3498db", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "8px", cursor: "pointer" },
  deleteBtn: { backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "8px", cursor: "pointer" },
  addBookSection: { marginTop: "30px", padding: "20px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", color: "#fff" },
  addForm: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" },
  input: { flex: "1", minWidth: "150px", padding: "10px 15px", borderRadius: "8px", border: "none", outline: "none", background: "rgba(255,255,255,0.05)", color: "#fff" },
  addBtn: { background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", cursor: "pointer" },
  aboutSection: { marginTop: "40px", padding: "25px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", color: "#fff", textAlign: "center" },
  footer: { textAlign: "center", marginTop: "40px", padding: "20px", color: "#fff", fontSize: "14px" },
};

export default Books;
