import { useState } from "react";
import "./Motivation.css";

const quotes = [
  "You're doing great [name]!",
  "Keep reaching for the stars [name]!",
  "Your addiction does not define you [name]!",
  "Recovery takes time [name]!",
  "Your future depends on what you do today [name]!"
];

function Motivation({ setPage, name = "friend" }) {
  const [quote, setQuote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const [urgeMode, setUrgeMode] = useState(false);

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const randomChallenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  return (
    <div className="motivation-page">

      {/* normal */}
      {!urgeMode && (
        <>
          <div className="motivation-header">
            <h1>Motivation</h1>

            <p className="motivation-subtitle">
              {quote.replaceAll("[name]", name)}
            </p>
          </div>

          <div className="motivation-actions-top">

            <button className="primary-btn" onClick={generateQuote}>
              New Quote
            </button>

            <button className="small-btn" onClick={() => setPage("awards")}>
              View Rewards
            </button>

            <button
              className="small-btn"
              onClick={() => setUrgeMode(true)}
            >
              I’m having an urge
            </button>

          </div>

          <div className="motivation-content">

            <div className="card motivation-card">

              <h3>Last Check-In</h3>

              <p className="muted-text">
                Keep journaling daily — even small entries matter.
              </p>

              <button
                className="primary-btn"
                onClick={() => setPage("log")}
              >
                Go to Journal
              </button>

            </div>

            <div className="motivation-side">

              <button
                className="small-btn"
                onClick={() => setPage("calendar")}
              >
                Check Calendar
              </button>

              <button
                className="small-btn"
                onClick={() => setPage("home")}
              >
                Back Home
              </button>

            </div>

          </div>
        </>
      )}

      {/* overlay */}
      {urgeMode && (
        <div className="urge-overlay">

          <div className="urge-box card">

            <h2>It will pass.</h2>

            <p>
              You don’t need to act on this feeling right now.
              Just pause for a moment.
            </p>

            <div className="challenge-box">
              Distract yourself by doing this task:
              <br />
              <strong>{randomChallenge}</strong>
            </div>

            <button
              className="primary-btn"
              onClick={() => setUrgeMode(false)}
            >
              I’m okay now
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Motivation;


