import { useState, useEffect } from "react";
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

// Round up to nearest 5 minutes
function roundToFiveMinutes(minute) {
  return Math.ceil(minute / 5) * 5;
}

// Random duration helper
function randomDuration(min = 30, max = 120) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate smart suggestions
function generateSmartSuggestions(tasks, busySlots) {
  const suggestions = [];

  tasks.forEach((task) => {
    // Random starting minute, snapped to 5
    let m = 8 * 60 + Math.floor(Math.random() * (12 * 60 - task.duration));
    m = roundToFiveMinutes(m);
    let found = false;

    // Try up to 48 slots (12 hours / 15 min increments)
    for (let i = 0; i < 48; i++) {
      const startTime = minutesToTime(m);
      if (isAvailable(startTime, task.duration, busySlots)) {
        const endTime = addTime(startTime, task.duration);
        suggestions.push({ ...task, start: startTime, end: endTime, accepted: null });
        busySlots.push([timeToMinutes(startTime), timeToMinutes(endTime)]);
        found = true;
        break;
      }

      m += 15;
      m = roundToFiveMinutes(m); // snap after increment
      if (m > 24 * 60 - task.duration) m = 8 * 60;
    }

    if (!found) {
      suggestions.push({ ...task, start: "TBD", end: "TBD", accepted: null });
    }
  });

  return suggestions;
}

// --- Component ---
export default function AiSuggestions() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const initialBusySlots = [
    [timeToMinutes("12:00"), timeToMinutes("17:00")], // Classes
    [timeToMinutes("00:00"), timeToMinutes("08:00")], // Sleep
    [timeToMinutes("18:00"), timeToMinutes("19:00")], // Dinner
  ];

  // Fetch daily tasks
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    fetch(`/api/ai/daily/${today}`)
      .then((res) => res.json())
      .then((dailyTasks) => {
        const tasksToSchedule = dailyTasks.map((t) => ({
          id: t.id,
          task: t.task,
          duration: t.duration || randomDuration(30, 120),
        }));

        const smart = generateSmartSuggestions(tasksToSchedule, [...initialBusySlots]);
        setSuggestions(smart);
      })
      .catch(console.error);
  }, []);

  // Accept / decline tasks
  const handleDecision = (id, decision) => {
    setSuggestions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, accepted: decision } : t))
    );
  };

  // Regenerate with shuffled order, random durations, and snapped start times
  const handleRegenerate = () => {
    if (!suggestions || suggestions.length === 0) return;

    const acceptedTasks = suggestions.filter((t) => t.accepted === true);

    const unacceptedTasks = suggestions
      .filter((t) => t.accepted !== true)
      .map((t) => ({
        ...t,
        start: undefined,
        end: undefined,
        duration: randomDuration(30, 120),
      }))
      .sort(() => Math.random() - 0.5);

    const busySlots = [
      ...initialBusySlots,
      ...acceptedTasks.map((t) => [timeToMinutes(t.start), timeToMinutes(t.end)]),
    ];

    const newUnaccepted = generateSmartSuggestions(unacceptedTasks, busySlots);

    setSuggestions([...acceptedTasks, ...newUnaccepted]);
  };

  // Total time
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

      <main className="suggestions-main">
        <div className="blurb pixel-font">
          <p>Here’s the best order to complete your tasks today</p>
          <p>
            You’ll need {totalTime.h}h {totalTime.m}m
          </p>
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
