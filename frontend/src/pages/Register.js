import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login pas register
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/books");
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span style={styles.loginLink} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(15px)",
    padding: "50px 35px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
    width: "350px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "transform 0.3s",
  },
  title: {
    marginBottom: "25px",
    color: "#fff",
    fontSize: "28px",
    fontWeight: "700",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.4)",
    fontSize: "14px",
    outline: "none",
    color: "#fff",
    background: "rgba(255, 255, 255, 0.05)",
    transition: "0.3s",
  },
  button: {
    padding: "12px 0",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #b543e9ff, #38f9d7)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  buttonHover: {
    transform: "scale(1.05)",
  },
  inputFocus: {
    border: "1px solid #43e97b",
    background: "rgba(255,255,255,0.15)",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  loginText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
  },
  loginLink: {
    color: "#38f9d7",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;
