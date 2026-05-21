import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function Sidebar({ setPage, page }) {
  return (
    <aside className="sidebar">

      <div>
        <h1 className="logo">Chronyx</h1>

        <div className="nav-links">

          <button
            className={page === "home" ? "active-tab" : ""}
            onClick={() => setPage("home")}
          >
            Dashboard
          </button>

          <button
            className={page === "log" ? "active-tab" : ""}
            onClick={() => setPage("log")}
          >
            Daily Log
          </button>

          <button
            className={page === "calendar" ? "active-tab" : ""}
            onClick={() => setPage("calendar")}
          >
            Calendar
          </button>

          <button
            className={page === "motivation" ? "active-tab" : ""}
            onClick={() => setPage("motivation")}
          >
            Motivation
          </button>

          <button
            className={page === "awards" ? "active-tab" : ""}
            onClick={() => setPage("awards")}
          >
            Awards
          </button>

          <button
            className={page === "reason" ? "active-tab" : ""}
            onClick={() => setPage("reason")}
          >
            Reasons
          </button>

        </div>
      </div>

      <button
        className="logout-btn"
        onClick={async () => {
          await signOut(auth);
          setPage("LoginPage");
        }}
      >
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;