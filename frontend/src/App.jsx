import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import hospitalImg from "./assets/hospital.png";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login with:", { fullName, email, password });
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Healthify Logo" className="logo" />
        </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Login</a>
          <a href="#">Contact us</a>
          <div className="hamburger-menu">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </nav>

      <div className="main-card">
        <div className="left-section">
          <h1>WELCOME!</h1>
          <p className="subtitle">Sign up to create new account</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
        <div className="right-section">
          <img src={hospitalImg} alt="Surgery" className="cover-image" />
        </div>
      </div>
    </div>
  );
}

export default App;