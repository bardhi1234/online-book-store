import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/books");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <h2 style={styles.title}>📚 MyBookStore Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 0 12px rgba(56,249,215,0.8)")
            }
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 0 12px rgba(56,249,215,0.8)")
            }
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 15px rgba(56,249,215,0.8)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <span style={styles.registerLink} onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    padding: "50px 35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    width: "360px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.5s ease",
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
    border: "1px solid rgba(255,255,255,0.3)",
    fontSize: "14px",
    outline: "none",
    color: "#fff",
    background: "rgba(255,255,255,0.05)",
    transition: "0.3s",
  },
  button: {
    padding: "12px 0",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  registerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
  },
  registerLink: {
    color: "#38f9d7",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
