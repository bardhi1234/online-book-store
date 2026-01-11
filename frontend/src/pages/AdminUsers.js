import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : null;

  useEffect(() => {
    // Vetëm admin mund të hyjë
    if (!token || userRole !== "admin") {
      navigate("/books");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned HTML, jo JSON. Kontrollo endpoint-in!");
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Gabim në fetch users");
        }

        const data = await res.json();
        // Shto fade property tek çdo user
        const usersWithFade = data.map((u) => ({ ...u, fading: false }));
        setUsers(usersWithFade);
      } catch (err) {
        console.error(err);
        setError(err.message || "Gabim në marrjen e user-ve");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, token, userRole]);

  // Fshirja me kontroll për porosi aktive dhe fade-out
  const handleDelete = async (user) => {
    // Kontrollo në frontend
    if (user.role === "admin") {
      alert("Nuk mund të fshihet admin");
      return;
    }

    if (user.hasActiveOrders) {
      alert("Ky user ka porosi aktive dhe nuk mund të fshihet");
      return;
    }

    const confirmDelete = window.confirm("A dëshironi të fshini këtë user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gabim gjatë fshirjes së user-it");
      }

      // Shto fade tek user
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, fading: true } : u))
      );

      // Pas 300ms heq user nga lista
      setTimeout(() => {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }, 300);
    } catch (err) {
      console.error(err);
      alert(err.message || "Gabim gjatë fshirjes së user-it");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👤 Lista e User-ve</h1>
      {loading && <p style={styles.loading}>Duke ngarkuar user-at...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th>ID</th>
              <th>Emri</th>
              <th>Email</th>
              <th>Roli</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u, idx) => {
                const cannotDelete = u.role === "admin" || u.hasActiveOrders;

                return (
                  <tr
                    key={u.id}
                    style={{
                      ...styles.row,
                      backgroundColor: idx % 2 === 0 ? "#2c2c3e" : "#262635",
                      opacity: u.fading ? 0 : 1,
                      transition: "background 0.2s, transform 0.15s, opacity 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3a3a50";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#2c2c3e" : "#262635";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span style={u.role === "admin" ? styles.adminBadge : styles.userBadge}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{
                          ...styles.deleteBtn,
                          opacity: cannotDelete ? 0.5 : 1,
                          cursor: cannotDelete ? "not-allowed" : "pointer",
                        }}
                        onClick={() => handleDelete(u)}
                        disabled={cannotDelete}
                        title={
                          u.role === "admin"
                            ? "Nuk mund të fshihet admin"
                            : u.hasActiveOrders
                            ? "Ky user ka porosi aktive"
                            : "Fshi user"
                        }
                      >
                        Fshi
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "15px", color: "#aaa" }}>
                  {error ? "Gabim në marrjen e user-ve" : "Nuk u gjet asnjë user"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer style={styles.footer}>
        © 2026 MyBookStore — Të gjitha të drejtat e rezervuara
      </footer>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#1e1e2f",
    minHeight: "100vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "25px",
    fontSize: "2em",
    color: "#f5f5f5",
    textShadow: "1px 1px 5px rgba(0,0,0,0.4)",
  },
  loading: { color: "#ccc" },
  error: { color: "#e74c3c", fontWeight: "bold" },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    backgroundColor: "#2c2c3e",
    padding: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    flexGrow: 1,
    maxHeight: "60vh",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95em",
    minWidth: "700px",
  },
  thead: {
    background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  row: {
    borderBottom: "1px solid #444",
    cursor: "default",
  },
  adminBadge: {
    padding: "4px 10px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "0.85em",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  userBadge: {
    padding: "4px 10px",
    backgroundColor: "#3498db",
    color: "#fff",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "0.85em",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  deleteBtn: {
    padding: "5px 10px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background 0.2s, transform 0.15s",
  },
  footer: {
    marginTop: "20px",
    padding: "15px",
    textAlign: "center",
    color: "#bbb",
    fontSize: "0.9em",
    borderTop: "1px solid #444",
  },
};

export default AdminUsers;
