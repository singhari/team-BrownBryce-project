import { useState, useEffect } from 'react';
import './Calendar.css';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function Calendar({ setPage }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let i = 1; i <= totalDays; i++) dates.push(i);

  useEffect(() => {
    const fetchSavedRange = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "dateRanges", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const start = data.startDate?.toDate?.();
          const end = data.endDate?.toDate?.();

          if (start) {
            setStartDate(start);
            setCurrentDate(new Date(start.getFullYear(), start.getMonth()));
          }

          if (end) setEndDate(end);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRange();
  }, []);

  const handleDateClick = (day) => {
    if (!day) return;

    const clicked = new Date(year, month, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clicked);
      setEndDate(null);
    } else if (clicked < startDate) {
      setStartDate(clicked);
    } else {
      setEndDate(clicked);
    }
  };

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir));
  };

  const saveRange = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first!");
      return;
    }

    try {
      const start = startDate;
      const end = endDate;
  
      
      await setDoc(doc(db, "dateRanges", user.uid), {
        uid: user.uid,
        startDate,
        endDate,
        updatedAt: serverTimestamp(),
      });

      alert("Your date range has been updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to save range.");
    }
  };
  

  return (
    <div className="calendar-page">

      <div className="calendar-card">

        <div className="calendar-top">
          <button className="small-btn" onClick={() => changeMonth(-1)}>
            Previous
          </button>

          <h2>{monthNames[month]} {year}</h2>

          <button className="small-btn" onClick={() => changeMonth(1)}>
            Next
          </button>
        </div>

        <div className="calendar-grid">

          {daysOfWeek.map((d) => (
            <div key={d} className="day-header">{d}</div>
          ))}

          {dates.map((day, i) => {
            const dateObj = day ? new Date(year, month, day) : null;

            const isSelected =
              dateObj &&
              (dateObj.toDateString() === startDate?.toDateString() ||
               dateObj.toDateString() === endDate?.toDateString());

            const isInRange =
              dateObj &&
              startDate &&
              endDate &&
              dateObj > startDate &&
              dateObj < endDate;

            return (
              <div
                key={i}
                className={`date-box ${day ? 'active' : 'empty'}
                  ${isSelected ? 'selected' : ''}
                  ${isInRange ? 'in-range' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            );
          })}

        </div>

        {/* description */}
        <p className="calendar-desc">
          Select a start date and an end date to define your tracking period and addiction quitting journey.
          This range is saved to your account and used to visualize and remember your progress.
        </p>

        {/* button group (fixed spacing) */}
        <div className="calendar-actions">

          <button className="big-btn" onClick={saveRange}>
            Confirm Range
          </button>

          <button className="small-btn" onClick={() => setPage('home')}>
            Back
          </button>

        </div>

      </div>
      
    </div>
  );
}
