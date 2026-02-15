import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ViewUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gabim gjatë marrjes së user-it");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  if (loading) return <p>Duke ngarkuar user-in...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>User-i nuk u gjet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Shiko User {user.id}</h1>
      <p><b>Emri:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
    </div>
  );
}

export default ViewUser;
