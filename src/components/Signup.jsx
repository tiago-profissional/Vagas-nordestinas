import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const demoUser = {
        id: Date.now(),
        name,
        email,
      };

      localStorage.setItem("user", JSON.stringify(demoUser));

      toast.success("Demo account created successfully!");
      clearFields();

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

      setLoading(false);
    }, 700);
  };

  return (
    <div className="auth-page">
      <form className="auth-form-card" onSubmit={handleSignup}>
        <div className="auth-header">
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Create your account</p>
          <div className="auth-underline"></div>
        </div>

        <div className="auth-inputs">
          <div className="auth-input-wrapper">
            <input
              className="auth-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="auth-input-wrapper">
            <input
              className="auth-input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="auth-main-submit" disabled={loading}>
          {loading ? "Please wait..." : "Sign Up"}
        </button>

        <p className="auth-bottom-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-bottom-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;