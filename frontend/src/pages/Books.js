import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // add
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // edit
  const [editingBook, setEditingBook] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/");

    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (!u?.role) throw new Error();
      setUser(u);
      fetchBooks();
    } catch {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate, token]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBooks(data);
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ---------- ADD ----------
  const addBook = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);

    await fetch(`${BASE_URL}/books`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setTitle("");
    setAuthor("");
    setPrice("");
    setImageFile(null);
    fetchBooks();
  };

  // ---------- DELETE ----------
  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    await fetch(`${BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  // ---------- EDIT ----------
  const openEdit = (book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditPrice(book.price || "");
  };

  const saveEdit = async () => {
    await fetch(`${BASE_URL}/books/${editingBook.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editTitle,
        author: editAuthor,
        price: editPrice,
      }),
    });

    setEditingBook(null);
    fetchBooks();
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>📚 MyBookStore</h1>
        <div style={styles.userBox}>
          <p style={styles.userText}>{user?.name} <span style={styles.role}>({user?.role})</span></p>
          <button onClick={logout} style={styles.logout}>Logout</button>
        </div>
      </header>

      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* BOOKS */}
      <div style={styles.grid}>
        {books.map((book) => (
          <div key={book.id} style={styles.card}>
            {book.image && (
              <img
                src={`http://localhost:5000/uploads/${book.image}`}
                alt={book.title}
                style={styles.image}
              />
            )}
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.bookAuthor}>{book.author}</p>
            {book.price && <p style={styles.bookPrice}>€{book.price}</p>}

            {user?.role === "admin" && (
              <div style={styles.adminBtns}>
                <button style={styles.editBtn} onClick={() => openEdit(book)}>
                  ✏️ Edit
                </button>
                <button style={styles.deleteBtn} onClick={() => deleteBook(book.id)}>
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD */}
      {user?.role === "admin" && (
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Add Book</h2>
          <form onSubmit={addBook} style={styles.form}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required style={styles.input}/>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required style={styles.input}/>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" style={styles.input}/>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} style={styles.fileInput}/>
            <button style={styles.addBtn}>Add</button>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingBook && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Edit Book</h3>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={styles.input}/>
            <input value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} style={styles.input}/>
            <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={styles.input}/>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={saveEdit} style={styles.saveBtn}>💾 Save</button>
              <button onClick={() => setEditingBook(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 MyBookStore. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.2)",
    marginBottom: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "1px",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userText: {
    margin: 0,
    fontWeight: "500",
    fontSize: "16px",
  },
  role: {
    fontStyle: "italic",
    fontSize: "0.9em",
    color: "#ddd",
  },
  logout: {
    background: "#e74c3c",
    border: "none",
    padding: "8px 16px",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s",
  },
  logoutHover: {
    background: "#c0392b",
  },
  loading: {
    fontSize: "18px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
    gap: "25px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.4)",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "10px",
  },
  bookTitle: { fontSize: "18px", fontWeight: "600", margin: "5px 0" },
  bookAuthor: { fontSize: "15px", color: "#ddd", margin: "5px 0" },
  bookPrice: { fontSize: "16px", fontWeight: "600", margin: "5px 0", color: "#fff" },
  adminBtns: { display: "flex", gap: "10px", marginTop: "10px" },
  editBtn: {
    flex: 1,
    background: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  deleteBtn: {
    flex: 1,
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  formBox: {
    marginTop: "40px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.1)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
  },
  formTitle: { fontSize: "22px", marginBottom: "15px" },
  form: { display: "flex", gap: "15px", flexWrap: "wrap" },
  input: {
    flex: "1 1 150px",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },
  fileInput: { flex: "1 1 100%", padding: "5px 0" },
  addBtn: {
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "rgba(255,255,255,0.15)",
    padding: "25px",
    borderRadius: "20px",
    backdropFilter: "blur(15px)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    minWidth: "300px",
  },
  modalTitle: { fontSize: "20px", fontWeight: "600" },
  saveBtn: {
    flex: 1,
    background: "#2ecc71",
    border: "none",
    borderRadius: "8px",
    padding: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    background: "#e74c3c",
    border: "none",
    borderRadius: "8px",
    padding: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  footer: {
    marginTop: "auto",
    padding: "20px",
    textAlign: "center",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "0.9em",
    boxShadow: "0 -4px 15px rgba(0,0,0,0.3)",
  },
  error: { color: "#ffcccc", textAlign: "center", marginTop: "20px" },
};

export default Books;
