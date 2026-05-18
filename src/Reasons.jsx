import AddictionSelection from "./AddictionSelection";
import ReasonSelection from "./ReasonSelection";
import App from "./App";
import "./Reason.css";

import { useState } from "react";

function Reasons() {
  const [currentAddiction, setCurrentAddiction] =
    useState("Scrolling");

  const [currentQuitReason, setCurrentQuitReason] =
    useState("Not set yet");

  const [page, setPage] = useState("home");

  if (page === "App") {
    return <App setPage={setPage} />;
  }

  return (
    <div className="banana">

      {/* header */}
      <div className="page-header">

        <h1>Personalize Your Journey</h1>

        <p>
          Set up your recovery dashboard and personalize your
          experience to stay motivated, build consistency,
          and better understand your habits.
        </p>

      </div>

      {/* main */}
      <div className="selection-layout">

        <AddictionSelection
          initialAddiction={currentAddiction}
          onAddictionSaved={setCurrentAddiction}
        />

        <ReasonSelection
          initialQuitReason={currentQuitReason}
          onQuitReasonSaved={setCurrentQuitReason}
        />

      </div>

      {/* current */}
      <div className="current-row">

        <div className="current-box">

          <div className="current-label">
            Current addiction
          </div>

          <div className="current-value">
            {currentAddiction}
          </div>

        </div>

        <div className="current-box">

          <div className="current-label">
            Reason to quit
          </div>

          <div className="current-value">
            {currentQuitReason}
          </div>

        </div>

      </div>

      {/* home */}
      <button
        onClick={() => setPage("App")}
        className="big-btn"
      >
        Go Back Home
      </button>

    </div>
  );
}

export default Reasons;