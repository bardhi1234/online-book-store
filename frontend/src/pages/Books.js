import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fields for adding a new book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fields for editing a book
  const [editingBook, setEditingBook] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  const BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBooks(data);
    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return navigate("/");
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
      fetchBooks();
    } catch {
      navigate("/");
    }
  }, [navigate, token, fetchBooks]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ---------------- Admin Buttons ----------------
  const AdminButtons = () => {
    const navigate = useNavigate(); // <- fix gabimin
    return (
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button style={styles.ordersBtn} onClick={() => navigate("/orders")}>
          📦 View Orders
        </button>
        <button
          style={{ ...styles.ordersBtn, background: "#9b59b6" }}
          onClick={() => navigate("/admin/users")}
        >
          👤 View Users
        </button>
      </div>
    );
  };

  // ---------------- Add Book ----------------
  const addBook = async (e) => {
    e.preventDefault();
    if (!title || !author || !price || !stock)
      return alert("Please fill all fields");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to add book");

      setTitle("");
      setAuthor("");
      setPrice("");
      setStock("");
      setImageFile(null);
      fetchBooks();
    } catch {
      alert("Server error");
    }
  };

  // ---------------- Delete Book ----------------
  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    await fetch(`${BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  // ---------------- Edit Book ----------------
  const openEdit = (book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditPrice(book.price);
    setEditStock(book.stock);
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
        price: Number(editPrice),
        stock: Number(editStock),
      }),
    });
    setEditingBook(null);
    fetchBooks();
  };

  // ---------------- Make Order ----------------
  const makeOrder = async (book, quantity) => {
    if (quantity < 1) return alert("Quantity must be at least 1");
    if (quantity > book.stock) return alert("Not enough stock");

    await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [{ book_id: book.id, quantity, price: book.price }],
      }),
    });
    alert("✅ Order placed successfully");
    fetchBooks();
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 MyBookStore</h1>
          <p style={styles.subtitle}>Discover & order your favorite books</p>
        </div>
        <div style={styles.userBox}>
          <div>
            <strong>{user?.name}</strong>
            <div style={styles.role}>{user?.role}</div>
          </div>
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ---------------- ADMIN BUTTONS ---------------- */}
      {user?.role === "admin" && <AdminButtons />}

      <input
        style={styles.search}
        placeholder="🔍 Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            user={user}
            makeOrder={makeOrder}
            deleteBook={deleteBook}
            openEdit={openEdit}
          />
        ))}
      </div>

      {/* ---------------- Admin Add Book Form ---------------- */}
      {user?.role === "admin" && (
        <div style={styles.formBox}>
          <h2>Add New Book</h2>
          <form style={styles.form} onSubmit={addBook}>
            <input
              style={styles.input}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              style={styles.input}
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              style={styles.input}
              type="number"
              placeholder="Stock"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button style={styles.addBtn}>➕ Add Book</button>
          </form>
        </div>
      )}

      {/* ---------------- Edit Modal ---------------- */}
      {editingBook && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <h3>Edit Book</h3>
            <input
              style={styles.input}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              style={styles.input}
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
            />
            <input
              style={styles.input}
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
            <input
              style={styles.input}
              type="number"
              min="0"
              value={editStock}
              onChange={(e) => setEditStock(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button style={styles.saveBtn} onClick={saveEdit}>
                Save
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setEditingBook(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, user, makeOrder, deleteBook, openEdit }) {
  const [quantity, setQuantity] = useState(1);
  const total = (book.price * quantity).toFixed(2);

  return (
    <div style={styles.card}>
      <img
        src={
          book.image
            ? `http://localhost:5000/uploads/${book.image.trim()}`
            : "https://via.placeholder.com/220x220?text=No+Image"
        }
        alt={book.title}
        style={styles.image}
      />
      <h3>{book.title}</h3>
      <p style={styles.author}>{book.author}</p>
      <div style={styles.price}>€ {book.price}</div>
      <div>Stock: {book.stock}</div>

      {user?.role === "admin" ? (
        <div style={styles.adminBtns}>
          <button style={styles.editBtn} onClick={() => openEdit(book)}>
            ✏️ Edit
          </button>
          <button style={styles.deleteBtn} onClick={() => deleteBook(book.id)}>
            🗑 Delete
          </button>
        </div>
      ) : (
        <>
          <div>
            <label>
              Quantity:{" "}
              <input
                type="number"
                min="1"
                max={book.stock}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 1) setQuantity(1);
                  else if (val > book.stock) setQuantity(book.stock);
                  else setQuantity(val);
                }}
                style={{ width: "60px", borderRadius: "6px", padding: "2px 6px" }}
              />
            </label>
          </div>
          <div>Total: € {total}</div>
          <button style={styles.orderBtn} onClick={() => makeOrder(book, quantity)}>
            🛒 Order Book
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "40px", background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", color: "#fff", fontFamily: "Segoe UI, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
  title: { fontSize: "36px" },
  subtitle: { opacity: 0.8 },
  userBox: { display: "flex", gap: "20px", alignItems: "center" },
  role: { fontSize: "0.8em", opacity: 0.7 },
  logout: { background: "#e74c3c", border: "none", padding: "8px 14px", borderRadius: "10px", color: "#fff" },
  ordersBtn: { background: "#3498db", border: "none", padding: "10px 20px", borderRadius: "12px", color: "#fff", fontWeight: 600 },
  search: { width: "100%", padding: "14px 18px", borderRadius: "14px", border: "none", marginBottom: "30px", fontSize: "16px", color: "#000" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "30px" },
  card: { background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", backdropFilter: "blur(12px)" },
  image: { width: "100%", height: "220px", objectFit: "cover", borderRadius: "15px" },
  author: { opacity: 0.7 },
  price: { fontWeight: "700", margin: "10px 0" },
  adminBtns: { display: "flex", gap: "10px" },
  editBtn: { flex: 1, background: "#3498db", border: "none", borderRadius: "10px", padding: "8px", color: "#fff" },
  deleteBtn: { flex: 1, background: "#e74c3c", border: "none", borderRadius: "10px", padding: "8px", color: "#fff" },
  orderBtn: { width: "100%", background: "#2ecc71", border: "none", borderRadius: "12px", padding: "10px", color: "#fff", fontWeight: "600" },
  formBox: { marginTop: "50px", background: "rgba(255,255,255,0.1)", padding: "25px", borderRadius: "20px" },
  form: { display: "flex", gap: "15px", flexWrap: "wrap" },
  input: { padding: "8px 12px", borderRadius: "10px", border: "none" },
  addBtn: { background: "#2ecc71", border: "none", borderRadius: "12px", padding: "10px 20px", color: "#fff" },
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "rgba(255,255,255,0.15)", padding: "25px", borderRadius: "20px", backdropFilter: "blur(15px)" },
  saveBtn: { background: "#2ecc71", border: "none", padding: "10px", borderRadius: "10px" },
  cancelBtn: { background: "#e74c3c", border: "none", padding: "10px", borderRadius: "10px" },
  loading: { textAlign: "center" },
  error: { color: "#ffcccc", textAlign: "center" },
};

export default Books;
