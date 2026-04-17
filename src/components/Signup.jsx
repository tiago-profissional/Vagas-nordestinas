import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

function LoginSignup() {
  const navigate = useNavigate();

  const API_URL = "https://vagas-nordestinas.onrender.com/api";

  const [action, setAction] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const changeAction = (newAction) => {
    setAction(newAction);
    setError("");
    setMessage("");
    clearFields();
  };

  const handleForm = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (action === "Sign Up") {
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else {
      if (!email || !password) {
        setError("Please fill in email and password.");
        return;
      }
    }

    try {
      setLoading(true);

      const url =
        action === "Sign Up"
          ? `${API_URL}/register.php`
          : `${API_URL}/login.php`;

      const body =
        action === "Sign Up"
          ? { name, email, password, confirmPassword }
          : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseText = await res.text();
      console.log("Backend raw response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setError("Backend did not return valid JSON.");
        return;
      }

      if (data.success) {
        setMessage(data.message || `${action} successful!`);

        if (action === "Login" && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));

          clearFields();

          setTimeout(() => {
            navigate("/");
          }, 1000);

          return;
        }

        clearFields();
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form-card" onSubmit={handleForm}>
        <div className="auth-header">
          <h2 className="auth-title">{action}</h2>
          <p className="auth-subtitle">
            {action === "Sign Up"
              ? "Create your account"
              : "Login to your account"}
          </p>
          <div className="auth-underline"></div>
        </div>

        <div className="auth-inputs">
          {action === "Sign Up" && (
            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

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

          {action === "Sign Up" && (
            <div className="auth-input-wrapper">
              <input
                className="auth-input"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        {action === "Login" && (
          <div className="auth-forgot-password">
            Lost Password? <span>Click Here!</span>
          </div>
        )}

        {error && <p className="auth-error-message">{error}</p>}
        {message && <p className="auth-success-message">{message}</p>}

        <div className="auth-switch-buttons">
          <button
            type="button"
            className={
              action === "Sign Up"
                ? "auth-switch-btn auth-switch-btn-active"
                : "auth-switch-btn"
            }
            onClick={() => changeAction("Sign Up")}
          >
            Sign Up
          </button>

          <button
            type="button"
            className={
              action === "Login"
                ? "auth-switch-btn auth-switch-btn-active"
                : "auth-switch-btn"
            }
            onClick={() => changeAction("Login")}
          >
            Login
          </button>
        </div>

        <button type="submit" className="auth-main-submit" disabled={loading}>
          {loading ? "Please wait..." : action}
        </button>
      </form>
    </div>
  );
}

export default LoginSignup;