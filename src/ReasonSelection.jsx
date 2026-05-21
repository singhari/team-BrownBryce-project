import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

function ReasonSelection({
  initialQuitReason = "",
  onQuitReasonSaved
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(initialQuitReason || "");
  }, [initialQuitReason]);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const value = text.trim();
      if (!value) return;

      console.log("SAVING REASON:", value);

      await setDoc(
        doc(db, "users", user.uid),
        { quitReason: value },
        { merge: true }
      );

      onQuitReasonSaved?.(value);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="selection-card">

      <h3>Why Do You Want To Quit?</h3>

      <p>Your reason helps motivate you during difficult moments.</p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I want to quit because..."
      />

      <button onClick={handleSave} className="save-btn">
        Save Reason
      </button>

    </div>
  );
}

export default ReasonSelection;