import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // -----------------------------
  // Fetch all users
  // -----------------------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Gabim në server");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // On mount → check token & fetch users
  // -----------------------------
  useEffect(() => {
    if (!token || !currentUser || currentUser.role !== "admin") {
      navigate("/books"); // jo admin, kthehu
      return;
    }
    fetchUsers();
  }, [token, currentUser, navigate]);

  // -----------------------------
  // Edit user
  // -----------------------------
  const startEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, role: editRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update user");
      }

      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // -----------------------------
  // Delete user
  // -----------------------------
  const deleteUser = async (id) => {
    if (id === currentUser.id) return alert("Nuk mund të fshini veten!");
    if (!window.confirm("A je i sigurt që do fshihet user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <h1>👤 Users List</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  ) : (
                    user.name
                  )}
                </td>
                <td>{user.email}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <>
                      <button style={styles.saveBtn} onClick={saveEdit}>
                        💾 Save
                      </button>
                      <button style={styles.cancelBtn} onClick={() => setEditingUser(null)}>
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button style={styles.editBtn} onClick={() => startEdit(user)}>
                        ✏️ Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => deleteUser(user.id)}>
                        🗑 Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                {error ? error : "No users found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: { padding: "30px", fontFamily: "Segoe UI, sans-serif" },
  table: { width: "100%", borderCollapse: "collapse" },
  editBtn: { marginRight: "5px", padding: "4px 8px" },
  deleteBtn: { padding: "4px 8px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px" },
  saveBtn: { marginRight: "5px", padding: "4px 8px", background: "#2ecc71", color: "#fff", border: "none", borderRadius: "4px" },
  cancelBtn: { padding: "4px 8px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px" },
};

export default AdminUsers;
