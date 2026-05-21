import { useState, useEffect } from "react";
import "./Log.css";
import ClaimReward from "./Reward.jsx";

import { auth, db } from "./firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { formatLocalDate } from "./streakUtils";

function DailyLog({ setPage }) {

  const [rewardRefresh, setRewardRefresh] = useState(0);

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    rating: 5,
  });

  const [streak, setStreak] = useState(0);

  const [savedMessage, setSavedMessage] =
    useState("");


  useEffect(() => {

    async function loadData() {

      const user = auth.currentUser;

      if (!user) return;

      try {

        const snap = await getDoc(
          doc(db, "users", user.uid)
        );

        if (!snap.exists()) return;

        const data = snap.data();

        if (data.journalAnswers) {
          setAnswers(data.journalAnswers);
        }

        if (
          typeof data.journalStreak === "number"
        ) {
          setStreak(data.journalStreak);
        }

      } catch (e) {
        console.error(e);
      }
    }

    loadData();

  }, []);


  function handleChange(e) {

    const { name, value } = e.target;

    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  async function handleSave() {

    try {

      const user = auth.currentUser;

      if (!user) {
        alert("Please sign in first.");
        return;
      }

      const today =
        formatLocalDate(new Date());

      const userRef =
        doc(db, "users", user.uid);

      const snap =
        await getDoc(userRef);

      let currentStreak = 1;

      if (snap.exists()) {

        const data = snap.data();

        const lastDate =
          data.lastJournalDate;

        const oldStreak =
          typeof data.journalStreak === "number"
            ? data.journalStreak
            : 0;

       

        if (lastDate === today) {

          currentStreak = oldStreak;

        } else {

         

          const yesterday = new Date();

          yesterday.setDate(
            yesterday.getDate() - 1
          );

          const yesterdayFormatted =
            formatLocalDate(yesterday);

          if (
            lastDate === yesterdayFormatted
          ) {

            currentStreak =
              oldStreak + 1;

          } else {

            currentStreak = 1;
          }
        }
      }


      await setDoc(
        userRef,
        {
          journalAnswers: answers,

          lastJournalDate: today,

          journalStreak: currentStreak,
        },
        { merge: true }
      );

      setStreak(currentStreak);

      setRewardRefresh((k) => k + 1);

      setSavedMessage(
        "Check-in saved successfully!"
      );

      setTimeout(() => {
        setSavedMessage("");
      }, 2500);

    } catch (e) {

      console.error(e);

      alert(
        "Could not save journal."
      );
    }
  }

  return (

    <div className="log-page">

      {/* HEADER */}

      <div className="log-header">

        <h1 className="title">
          Daily Journal Entry
        </h1>

        <p className="subtitle">
          Answer a few quick questions about your
          journey daily. This helps track patterns,
          emotions, and progress over time.
        </p>

      </div>

      {/* STREAK */}

      <div className="streak-box">

        🔥 Current Streak:

        <span>
          {streak}
        </span>

        day{streak !== 1 ? "s" : ""}

      </div>

      {/* MAIN CARD */}

      <div className="log-card">

        {/* LEFT */}

        <div className="left">

          <div className="question">

            <label>
              1. Did you use or interact with the
              substance you are addicted to?
            </label>

            <input
              name="q1"
              value={answers.q1}
              onChange={handleChange}
            />

          </div>

          <div className="question">

            <label>
              2. How did you feel today?
            </label>

            <input
              name="q2"
              value={answers.q2}
              onChange={handleChange}
            />

          </div>

          <div className="question">

            <label>
              3. Did you need help from family or
              friends?
            </label>

            <input
              name="q3"
              value={answers.q3}
              onChange={handleChange}
            />

          </div>

          <div className="question">

            <label>
              4. How confident do you feel
              continuing to quit your addiction?
            </label>

            <input
              name="q4"
              value={answers.q4}
              onChange={handleChange}
            />

          </div>

          <div className="question">

            <label>
              5. On a scale of 1–5, how difficult
              was it to quit your addiction today?
            </label>

            <input
              type="range"
              min="1"
              max="5"
              name="rating"
              value={answers.rating}
              onChange={handleChange}
            />

            <div className="rating-value">
              {answers.rating}
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="right">

          <ClaimReward
            refreshKey={rewardRefresh}
          />

        </div>

      </div>

      {/* SAVE MESSAGE */}

      {savedMessage && (

        <div className="saved-message">

          {savedMessage}

        </div>

      )}

      {/* BUTTONS */}

      <div className="log-actions">

        <button
          className="save-btn"
          onClick={handleSave}
        >
          Save Check-In
        </button>

        <button
          className="small-btn"
          onClick={() => setPage("awards")}
        >
          View Awards
        </button>

        <button
          className="small-btn"
          onClick={() => setPage("home")}
        >
          Back Home
        </button>

      </div>

    </div>
  );
}

export default DailyLog;