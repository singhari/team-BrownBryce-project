import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./awards.css";

function Awards({ setPage, name }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoggedIn(!!user);

      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const q = query(
          collection(db, "awards"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        rows.sort((a, b) => {
          const ta = a.earnedAt?.toMillis?.() ?? 0;
          const tb = b.earnedAt?.toMillis?.() ?? 0;
          return tb - ta;
        });

        setItems(rows);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  function formatEarned(ts) {
    if (!ts?.toDate) return "";
    return ts.toDate().toLocaleString();
  }

  const displayName = name || "User";

  return (
    <div className="awards-page">

      {/* HEADER */}
      <div className="awards-header">
        <h1 className="awards-title">Awards</h1>
        <p className="awards-sub">
          {displayName}, your progress milestones and streak rewards.
        </p>
      </div>

      {/* STATES */}
      {loading ? (
        <div className="awards-state">Loading awards...</div>
      ) : !loggedIn ? (
        <div className="awards-state">Sign in to view awards.</div>
      ) : items.length === 0 ? (
        <div className="awards-state">
          No awards yet — keep journaling to unlock your first badge.
        </div>
      ) : (
        <div className="awards-grid">

          {items.map((a, index) => (
            <div key={a.id} className="award-card">

              {/* STAR BADGE */}
              <div className="award-image-wrap">

                <img
                  src={a.imageUrl}
                  className="award-img"
                  alt="award badge"
                />

                {/* number overlay */}
                <div className="award-number">
                  {a.day ?? index + 1}
                </div>

              </div>

              {/* text */}
              <div className="award-content">
                <p className="award-details">
                  {a.details}
                </p>

                <p className="award-meta">
                  {formatEarned(a.earnedAt)}
                </p>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* footer */}
      <div className="awards-footer">
        <button
          className="primary-btn"
          onClick={() => setPage("home")}
        >
          Back to Dashboard
        </button>
      </div>

    </div>
  );
}

export default Awards;