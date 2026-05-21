import AddictionSelection from "./AddictionSelection";
import ReasonSelection from "./ReasonSelection";
import App from "./App";
import "./Reason.css";

import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function Reasons() {
  const [currentAddiction, setCurrentAddiction] = useState("");
  const [currentQuitReason, setCurrentQuitReason] = useState("");
  const [page, setPage] = useState("home");

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCurrentAddiction(data.addiction || "");
        setCurrentQuitReason(data.quitReason || "");
      }
    };

    loadData();
  }, []);

  return (
    <>
      {page === "App" ? (
        <App setPage={setPage} />
      ) : (
        <div className="banana">

          <div className="page-header">
            <h1>Personalize Your Journey</h1>

            <p>
              Set up your recovery dashboard and personalize your experience
              to stay motivated, build consistency, and better understand your habits.
            </p>
          </div>

          <div className="selection-layout">

            <AddictionSelection
              initialAddiction={currentAddiction}
              onAddictionSaved={(value) => setCurrentAddiction(value)}
            />

            <ReasonSelection
              initialQuitReason={currentQuitReason}
              onQuitReasonSaved={(value) => setCurrentQuitReason(value)}
            />

          </div>

          <div className="current-row">

            <div className="current-box">
              <div className="current-label">Current addiction</div>
              <div className="current-value">{currentAddiction}</div>
            </div>

            <div className="current-box">
              <div className="current-label">Reason to quit</div>
              <div className="current-value">{currentQuitReason}</div>
            </div>

          </div>

          <button
            onClick={() => setPage("App")}
            className="big-btn"
          >
            Go Back Home
          </button>

        </div>
      )}
    </>
  );
}

export default Reasons;