import { useState, useEffect } from "react";

import { db, auth } from "./firebase";

import { doc, setDoc } from "firebase/firestore";

function ReasonSelection({
  initialQuitReason = "",
  onQuitReasonSaved
}) {

  const [text, setText] = useState("");

  useEffect(() => {
    setText(initialQuitReason);
  }, [initialQuitReason]);

  const handleSave = async () => {
    try {

      const value = text.trim();

      if (!value) {
        alert("Write your reason first.");
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        alert("You are not logged in.");
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        { quitReason: value },
        { merge: true }
      );

      onQuitReasonSaved?.(value);

      alert("Saved!");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="selection-card">

      <h3>Why Do You Want To Quit?</h3>

      <p>
        Your reason helps motivate you during difficult
        moments and reminds you why you started.
      </p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I want to quit because..."
      />

      <button
        type="button"
        onClick={handleSave}
        className="save-btn"
      >
        Save Reason
      </button>

    </div>
  );
}

export default ReasonSelection;