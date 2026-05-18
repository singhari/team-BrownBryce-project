import { useState } from "react";
import "./Log.css";
import ClaimReward from "./Reward.jsx";

function DailyLog({ setPage }) {
  const [rewardRefresh, setRewardRefresh] = useState(0);

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    rating: 5,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    
    setRewardRefresh((k) => k + 1);
  }

  return (
    <div className="log-page">

      {/* HEADER */}
      <div className="log-header">
        <h1 className="title">Daily Journal Entry</h1>

        <p className="subtitle">
          Answer a few quick questions about your journey daily. This helps track patterns,
          emotions, and progress over time.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="log-card">

        {/* LEFT: QUESTIONS */}
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

        {/* RIGHT: REWARD PANEL */}
        <div className="right">
          <ClaimReward refreshKey={rewardRefresh} />
        </div>

      </div>

      {/* SAVE + NAV BUTTONS */}
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