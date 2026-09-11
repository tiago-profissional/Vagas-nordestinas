import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Signup.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const demoUser = {
        id: Date.now(),
        name: "Demo User",
        email,
      };

      localStorage.setItem("user", JSON.stringify(demoUser));

      toast.success("Demo login successful!");
      clearFields();

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

      setLoading(false);
    }, 700);
  };

  return (
    <div className="auth-page">
      <form className="auth-form-card" onSubmit={handleLogin}>
        <div className="auth-header">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Login to your account</p>
          <div className="auth-underline"></div>
        </div>

        <div className="auth-inputs">
          <div className="auth-input-wrapper">
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-wrapper">
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>

        <button type="submit" className="auth-main-submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="auth-bottom-text">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="auth-bottom-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;