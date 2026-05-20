import { useState, useEffect } from "react";
import "./Log.css";
import ClaimReward from "./Reward.jsx";
import { auth, db } from "./firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  formatLocalDate,
  addDays,
} from "./streakUtils";

function DailyLog({ setPage }) {
  const [rewardRefresh, setRewardRefresh] = useState(0);

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    rating: 5,
  });

  useEffect(() => {
  const saved = localStorage.getItem("dailyLog");

  if (saved) {
    setAnswers(JSON.parse(saved));
  }
}, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
  const user = auth.currentUser;

  if (!user) {
    alert("Sign in first.");
    return;
  }

  
  if (
    !answers.q1 ||
    !answers.q2 ||
    !answers.q3 ||
    !answers.q4
  ) {
    alert("Please answer all questions first.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    const data = snap.exists() ? snap.data() : {};

    const last = data.lastJournalDate;

    const current =
      typeof data.journalStreak === "number"
        ? data.journalStreak
        : 0;

    const todayStr = formatLocalDate(new Date());

    const yesterdayStr = formatLocalDate(
      addDays(new Date(), -1)
    );

    
    if (last === todayStr) {
      alert("You already completed today's check-in.");
      return;
    }

    let next;

    if (!last) {
      next = 1;
    } else if (last === yesterdayStr) {
      next = current + 1;
    } else {
      next = 1;
    }

    await setDoc(
      userRef,
      {
        journalAnswers: answers,
        journalStreak: next,
        lastJournalDate: todayStr,
      },
      { merge: true }
    );

    localStorage.setItem(
      "dailyLog",
      JSON.stringify(answers)
    );

    alert(`Check-in saved! Your streak is ${next} day(s).`);

    setRewardRefresh((k) => k + 1);
  } catch (e) {
    console.error(e);
    alert("Could not save check-in.");
  }
}

  return (
    <div className="log-page">

      {/* header */}
      <div className="log-header">
        <h1 className="title">Daily Journal Entry</h1>

        <p className="subtitle">
          Answer a few quick questions about your journey daily. This helps track patterns,
          emotions, and progress over time.
        </p>
      </div>

      {/* main card */}
      <div className="log-card">

        {/* left side */}
        <div className="left">

          <div className="question">
            <label>1. Did you use or interact with the substance you are addicted to?</label>
            <input name="q1" value={answers.q1} onChange={handleChange} />
          </div>

          <div className="question">
            <label>2. How did you feel today?</label>
            <input name="q2" value={answers.q2} onChange={handleChange} />
          </div>

          <div className="question">
            <label>3. Did you need help from family or friends?</label>
            <input name="q3" value={answers.q3} onChange={handleChange} />
          </div>

          <div className="question">
            <label>4. How confident do you feel continuing to quit your addiction?</label>
            <input name="q4" value={answers.q4} onChange={handleChange} />
          </div>

          <div className="question">
            <label>5. On a scale of 1-5, how difficult was it to quit your addiction today? (1–5)</label>
            <input
              type="range"
              min="1"
              max="5"
              name="rating"
              value={answers.rating}
              onChange={handleChange}
            />
            <div className="rating-value">{answers.rating}</div>
          </div>

        </div>

        {/* right side */}
        <div className="right">
          <ClaimReward refreshKey={rewardRefresh} />
        </div>

      </div>

      {/* save and navigation buttons */}
      <div className="log-actions">

        <button className="save-btn" onClick={handleSave}>
          Save Check-In
        </button>

        <button className="small-btn" onClick={() => setPage("awards")}>
          View Awards
        </button>

        <button className="small-btn" onClick={() => setPage("home")}>
          Back Home
        </button>

      </div>

    </div>
  );
}

export default DailyLog;