import { useState, useEffect } from "react";

import { db, auth } from "./firebase";

import { doc, setDoc } from "firebase/firestore";

function AddictionSelection({
  initialAddiction = "",
  onAddictionSaved
}) {

  const [text, setText] = useState("");

  useEffect(() => {
    setText(initialAddiction);
  }, [initialAddiction]);

  const handleSave = async () => {
    try {

      const user = auth.currentUser;

      if (!user) {
        alert("You are not logged in.");
        return;
      }

      const value = text.trim();

      if (!value) {
        alert("Please enter an addiction.");
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        { addiction: value },
        { merge: true }
      );

      onAddictionSaved?.(value);

      alert("Saved!");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="selection-card">

      <h3>Select Your Addiction</h3>

      <p>
        Choose the habit you want to work on overcoming.
      </p>

      {/* BUTTON GRID */}
      <div className="addiction-grid">

        <button onClick={() => setText("Scrolling")}>
          Scrolling
        </button>

        <button onClick={() => setText("Video Games")}>
          Video Games
        </button>

        <button onClick={() => setText("Procrastination")}>
          Procrastination
        </button>

        <button onClick={() => setText("Fast Food")}>
          Fast Food
        </button>

        <button onClick={() => setText("Sugar")}>
          Sugar
        </button>

        <button onClick={() => setText("Caffeine")}>
          Caffeine
        </button>

        <button onClick={() => setText("Skin Picking")}>
          Skin Picking
        </button>

      </div>

      <p>
        Don't see your addiction listed? Enter your own:
      </p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter an addiction..."
      />

      <button
        onClick={handleSave}
        className="save-btn"
      >
        Save Addiction
      </button>

    </div>
  );
}

export default AddictionSelection;