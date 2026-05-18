import heroImg from './assets/hero.png';
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { streakIsActive } from "./streakUtils";

import "./App.css";

import DailyLog from "./Log.jsx";
import Calendar from "./Calendar.jsx";
import Motivation from "./Motivation.jsx";
import Reasons from "./Reasons.jsx";
import Awards from "./Awards.jsx";
import LoginPage from "./LoginPage.jsx";

function App() {
  const [name, setName] = useState("User");
  const [daysClean, setDaysClean] = useState(0);
  const [time, setTime] = useState(new Date());
  const [page, setPage] = useState("home");
  const [quote, setQuote] = useState("");

  const quotes = [
    "Small progress is still progress.",
    "Every day clean is a victory.",
    "Discipline creates freedom.",
    "You are stronger than your urges.",
    "Your future self will thank you.",
    "Healing takes time — keep going.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  async function loadStreak() {
    const user = auth.currentUser;

    if (!user) {
      setDaysClean(0);
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      setDaysClean(0);
      return;
    }

    const data = snap.data();

    const stored =
      typeof data.journalStreak === "number"
        ? data.journalStreak
        : 0;

    const last = data.lastJournalDate;

    setDaysClean(streakIsActive(last) ? stored : 0);
  }

  // greeting + streak from Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.displayName) {
        setName(user.displayName);
      } else if (user?.email) {
        setName(user.email.split("@")[0]);
      } else {
        setName("Name");
      }

      await loadStreak();
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (page === "home") {
      loadStreak();
    }
  }, [page]);

  // page switch
  if (page === "log") {
    return <DailyLog setPage={setPage} />;
  }

  if (page === "LoginPage") {
    return <LoginPage setPage={setPage} />;
  }

  if (page === "calendar") {
    return <Calendar setPage={setPage} />;
  }

  if (page === "reason") {
    return <Reasons setPage={setPage} name={name} />;
  }

  if (page === "motivation") {
    return <Motivation setPage={setPage} name={name} />;
  }

  if (page === "reason") {
    return <Reasons setPage={setPage} name={name} />;
  }

  if (page === "awards") {
    return <Awards setPage={setPage} name={name} />;
  }

  if (page === "LoginPage") {
    return <LoginPage setPage={setPage} />;
  }

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div>
          <h1 className="logo">Chronyx</h1>

          <div className="nav-links">

            <button
              className="active"
              onClick={() => setPage("home")}
            >
              Dashboard
            </button>

            <button onClick={() => setPage("log")}>
              Daily Log
            </button>

            <button onClick={() => setPage("calendar")}>
              Calendar
            </button>

            <button onClick={() => setPage("motivation")}>
              Motivation
            </button>

            <button onClick={() => setPage("awards")}>
              Awards
            </button>

            <button onClick={() => setPage("reason")}>
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

      {/* MAIN */}
      <main className="main-content">

        <div className="topbar">
          <div>
            <h1>Welcome back, {name}</h1>
            <p>Quit your addiction and build better habits every day.</p>
            <p>Start your journey to a healthier, more fulfilling lifestyle today with our website!</p>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">

          {/* STREAK */}
          <div className="card streak-card">
            <p className="card-label">Current Streak</p>

            <div className="streak-number">
              {daysClean}
            </div>

            <p className="streak-subtext">
              Days Clean
            </p>
          </div>

          {/* MOTIVATION */}
          <div className="card">
            <p className="card-label">Daily Motivation</p>

            <h2 className="quote">
              "{quote}"
            </h2>

            <button
              className="primary-btn"
              onClick={() => setPage("motivation")}
            >
              View Motivation
            </button>
          </div>

          {/* CALENDAR */}
          <div className="card">
            <p className="card-label">Track Progress</p>

            <h2>View Your Calendar</h2>

            <p>
              Check your streak history and stay consistent.
            </p>

            <button
              className="primary-btn"
              onClick={() => setPage("calendar")}
            >
              Open Calendar
            </button>
          </div>

          {/* JOURNAL */}
          <div className="card">
            <p className="card-label">Journal</p>

            <h2>Daily Reflection</h2>

            <p>
              Log thoughts, progress, and emotions every day.
            </p>

            <button
              className="primary-btn"
              onClick={() => setPage("log")}
            >
              Write Entry
            </button>
          </div>

          {/* REWARDS */}
          <div className="card">
            <p className="card-label">Achievements</p>

            <h2>Unlock Rewards</h2>

            <p>
              Celebrate milestones and progress achievements.
            </p>

            <button
              className="primary-btn"
              onClick={() => setPage("awards")}
            >
              View Awards
            </button>
          </div>

          {/* ⭐ NEW: REASONS CARD */}
          <div className="card">
            <p className="card-label">Personal Reasons</p>

            <h2>Addiction Selection</h2>

            <p>
              Select the addiction you're working to quit and reflect on your personal reasons for quitting.
            </p>

            <button
              className="primary-btn"
              onClick={() => setPage("reason")}
            >
              View Reasons
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default App;
