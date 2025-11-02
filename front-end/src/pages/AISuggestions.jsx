import { useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AISuggestions.css";

// --- Helper functions ---
function addTime(timeStr, minutesToAdd) {
  let [h, m] = timeStr.split(":").map(Number);
  m += minutesToAdd;
  h += Math.floor(m / 60);
  m = m % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

function isAvailable(startTime, durationMin, busySlots) {
  const start = timeToMinutes(startTime);
  const end = start + durationMin;
  return !busySlots.some(([bs, be]) => start < be && end > bs);
}

// --- Smart Scheduler ---
function generateSmartSuggestions(tasks, busySlots) {
  const suggestions = [];

  tasks.forEach((task) => {
    // Find earliest available slot
    for (let m = 8 * 60; m <= 24 * 60 - task.duration; m += 15) {
      const startTime = minutesToTime(m);
      if (isAvailable(startTime, task.duration, busySlots)) {
        const endTime = addTime(startTime, task.duration);
        suggestions.push({ ...task, start: startTime, end: endTime, accepted: null });
        // Mark this slot as now busy
        busySlots.push([timeToMinutes(startTime), timeToMinutes(endTime)]);
        break;
      }
    }

    // Fallback if no slot available
    if (!suggestions.find((t) => t.id === task.id)) {
      suggestions.push({ ...task, start: "TBD", end: "TBD", accepted: null });
    }
  });

  return suggestions;
}

export default function AiSuggestions() {
  const [menuOpen, setMenuOpen] = useState(false);

  // User calendar busy slots
  const initialBusySlots = [
    [timeToMinutes("12:00"), timeToMinutes("17:00")], // Classes
    [timeToMinutes("00:00"), timeToMinutes("08:00")], // Sleep
    [timeToMinutes("18:00"), timeToMinutes("19:00")], // Dinner
  ];

  const initialTasks = [
    { id: 1, task: "Study Math", duration: 90 },
    { id: 2, task: "Write Essay", duration: 120 },
    { id: 3, task: "Go to Gym", duration: 60 },
    { id: 4, task: "Read Book", duration: 45 },
  ];

  const [suggestions, setSuggestions] = useState(
    generateSmartSuggestions(initialTasks, [...initialBusySlots])
  );

  const handleDecision = (id, decision) => {
    setSuggestions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, accepted: decision } : t))
    );
  };

  const handleRegenerate = () => {
    // Shuffle tasks
    const shuffled = [...initialTasks].sort(() => Math.random() - 0.5);

    // Reset busy slots for this regeneration
    const newSuggestions = generateSmartSuggestions(shuffled, [...initialBusySlots]);
    setSuggestions(newSuggestions);
  };

  // Calculate total estimated time
  const totalTime = suggestions.reduce(
    (acc, t) => {
      acc.m += t.duration;
      acc.h += Math.floor(acc.m / 60);
      acc.m = acc.m % 60;
      return acc;
    },
    { h: 0, m: 0 }
  );

  return (
    <div className="page">
      <HeaderBar title="AI Suggestions" onHamburger={() => setMenuOpen(true)} />
        {/* <button></button> */}

      <main className="suggestions-main">
        <div className="blurb pixel-font">
          <p>Here’s the best order to complete your tasks today</p>
          <p>You’ll need {totalTime.h}h {totalTime.m}m</p>
        </div>

        <div className="suggestions-list">
          {suggestions.map((t) => (
            <div key={t.id} className="suggestion-card pixel-frame">
              <p className="pixel-font task">{t.task}</p>
              <p className="pixel-font time">
                {t.start} - {t.end} ({Math.floor(t.duration / 60)}h {t.duration % 60}m)
              </p>

              <div className="decision-buttons">
                <button
                  className="pixel-button"
                  onClick={() => handleDecision(t.id, true)}
                  disabled={t.accepted !== null}
                >
                  Accept
                </button>
                <button
                  className="pixel-button decline"
                  onClick={() => handleDecision(t.id, false)}
                  disabled={t.accepted !== null}
                >
                  Decline
                </button>
              </div>

              {t.accepted !== null && (
                <p className="pixel-font status">
                  {t.accepted ? "Added to calendar" : "Declined"}
                </p>
              )}
            </div>
          ))}
        </div>

        <button className="pixel-button regenerate" onClick={handleRegenerate}>
          Regenerate
        </button>


      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
