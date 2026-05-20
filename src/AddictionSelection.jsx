import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

function AddictionSelection({
  initialAddiction = "",
  onAddictionSaved
}) {
  const [text, setText] = useState(initialAddiction || "");

  useEffect(() => {
    setText(initialAddiction || "");
  }, [initialAddiction]);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const value = text.trim();
      if (!value) return;

      console.log("SAVING ADDICTION:", value);

      await setDoc(
        doc(db, "users", user.uid),
        { addiction: value },
        { merge: true }
      );

      onAddictionSaved?.(value);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="selection-card">

      <h3>Select Your Addiction</h3>

      <p>Choose the habit you want to work on overcoming.</p>

      <div className="addiction-grid">

        <button className={text === "Scrolling" ? "active" : ""} onClick={() => setText("Scrolling")}>
          Scrolling
        </button>

        <button className={text === "Video Games" ? "active" : ""} onClick={() => setText("Video Games")}>
          Video Games
        </button>

        <button className={text === "Procrastination" ? "active" : ""} onClick={() => setText("Procrastination")}>
          Procrastination
        </button>

        <button className={text === "Fast Food" ? "active" : ""} onClick={() => setText("Fast Food")}>
          Fast Food
        </button>

        <button className={text === "Sugar" ? "active" : ""} onClick={() => setText("Sugar")}>
          Sugar
        </button>

        <button className={text === "Caffeine" ? "active" : ""} onClick={() => setText("Caffeine")}>
          Caffeine
        </button>

        <button className={text === "Skin Picking" ? "active" : ""} onClick={() => setText("Skin Picking")}>
          Skin Picking
        </button>

      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter an addiction..."
      />

      <button onClick={handleSave} className="save-btn">
        Save Addiction
      </button>

    </div>
  );
}

export default AddictionSelection;