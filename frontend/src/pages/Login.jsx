import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./auth.css";
import church from "../assets/church.png";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uemail: "",
    upassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  /* 🔐 GOOGLE LOGIN (placeholder for now) */
  const handleGoogleLogin = () => {
    alert("Google login will be enabled soon");
    // Later:
    // window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="auth-wrapper login-layout">
      <div className="auth-form">
        <div className="form-box">
          <h1>Login</h1>

          <input
            type="email"
            placeholder="Email"
            name="uemail"
            value={formData.uemail}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            name="upassword"
            value={formData.upassword}
            onChange={handleChange}
          />

          <p className="forgot">Forgot Password!</p>

          <button className="primary-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="or">Or</div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
            />
            Continue with Google
          </button>

          <p className="switch">
            Don’t have an account?
            <span onClick={() => navigate("/register")}> Register</span>
          </p>
        </div>
      </div>

      <div className="auth-image curved-right">
        <img src={church} alt="church" />
      </div>
    </div>
  );
}
