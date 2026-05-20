import GoogleLogin from "./GoogleLogin";
import App from "./App.jsx";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./LoginPage.css";

function LoginPage() {
  const [page, setPage] = useState("login");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setPage("App");
    });
    return () => unsub();
  }, []);

  if (page === "App") {
    return <App setPage={setPage} />;
  }

  return (
    <div className="login-wrapper">

      {/* hero */}
      <div className="login-hero">
        <h1>Chronyx</h1>

        <p>
          Quit your addiction, track progress, and stay
          clean one day at a time.
        </p>

        <div className="login-stats">
          <div className="stat">
            <h3>Track</h3>
            <p>Daily progress</p>
          </div>

          <div className="stat">
            <h3>Reflect</h3>
            <p>Write journals</p>
          </div>

          <div className="stat">
            <h3>Grow</h3>
            <p>Build discipline</p>
          </div>
        </div>
      </div>

      {/* login card */}
      <div className="login-card">

        <h2>Welcome</h2>

        <div className="login-buttons">
          <div className="google-btn">
            <GoogleLogin onSignedIn={() => setPage("App")} />
          </div>

          <button
            className="guest-btn"
            onClick={() => setPage("App")}
          >
            Continue as Guest
          </button>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;