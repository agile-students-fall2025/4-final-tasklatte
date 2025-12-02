import { useState, useEffect, useCallback } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AISuggestions.css";

// --- Helper Functions ---
const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (m) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
};

const addTime = (timeStr, minutes) => {
  let [h, m] = timeStr.split(":").map(Number);
  m += minutes;
  h += Math.floor(m / 60);
  m %= 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const randomDuration = (min = 30, max = 120) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// --- Busy Minutes ---
const buildBusyMinutes = (classes, acceptedTasks, today) => {
  const busy = new Array(24 * 60).fill(false);
  const todayIndex = new Date(today).getDay();

  classes.forEach((c) => {
    if (c.days.includes(todayIndex)) {
      const start = timeToMinutes(c.startTime);
      const end = timeToMinutes(c.endTime);
      for (let m = start; m < end; m++) busy[m] = true;
    }
  });

  acceptedTasks.forEach((t) => {
    if (t.start && t.end) {
      const start = timeToMinutes(t.start);
      const end = timeToMinutes(t.end);
      for (let m = start; m < end; m++) busy[m] = true;
    }
  });

  return busy;
};

const findFreeBlock = (busy, duration, dayStart = 480, dayEnd = 1320) => {
  for (let i = dayStart; i <= dayEnd - duration; i++) {
    let canFit = true;
    for (let j = 0; j < duration; j++) {
      if (busy[i + j]) {
        canFit = false;
        i += j; // skip busy minutes
        break;
      }
    }
    if (canFit) return i;
  }
  return null;
};

const generateSafeSuggestions = (tasks, classes, acceptedTasks, today) => {
  const suggestions = [];
  const busy = buildBusyMinutes(classes, acceptedTasks, today);

  tasks.forEach((task) => {
    const startMin = findFreeBlock(busy, task.duration);
    if (startMin !== null) {
      const startTime = minutesToTime(startMin);
      const endTime = addTime(startTime, task.duration);
      suggestions.push({ ...task, start: startTime, end: endTime, accepted: null });

      for (let m = startMin; m < startMin + task.duration; m++) busy[m] = true;
    } else {
      suggestions.push({ ...task, start: "TBD", end: "TBD", accepted: null });
    }
  });

  return suggestions;
};

// --- Component ---
export default function AiSuggestions({ userId }) {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [classes, setClasses] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  // --- Load daily tasks & classes ---
  const loadDailyTasks = useCallback(async () => {
    try {
      const [classRes, taskRes] = await Promise.all([
        fetch(`/api/classes?userId=${userId}`),
        fetch(`/api/tasks?userId=${userId}&date=${today}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }),
      ]);

      const classData = await classRes.json();
      setClasses(classData);

      const tasks = await taskRes.json();
      const dailyTasks = tasks.map((t) => ({
        id: t._id,
        task: t.title,
        duration: t.duration || randomDuration(30, 120),
      }));

      const safeSuggestions = generateSafeSuggestions(dailyTasks, classData, [], today);
      setSuggestions(safeSuggestions);
    } catch (err) {
      console.error("Failed to load daily tasks:", err);
    }
  }, [userId, today]);

  useEffect(() => {
    loadDailyTasks();
  }, [loadDailyTasks]);

  // --- Accept / Decline task ---
  const handleDecision = async (id, decision) => {
    const task = suggestions.find((t) => t.id === id);
    if (!task) return;

    if (decision) {
      // Accept → update MongoDB
      try {
        await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ start: task.start, end: task.end, duration: task.duration }),
        });

        // Remove accepted task from suggestions
        setSuggestions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Failed to save task:", err);
      }
    } else {
      // Decline → regenerate this task
      const newTask = {
        ...task,
        start: undefined,
        end: undefined,
        duration: randomDuration(30, 120),
      };

      const newSuggestion = generateSafeSuggestions([newTask], classes, suggestions.filter((t) => t.id !== id), today);
      setSuggestions((prev) => prev.map((t) => (t.id === id ? newSuggestion[0] : t)));
    }
  };

  // --- Regenerate unaccepted tasks and update accepted tasks in MongoDB ---
  const handleRegenerate = async () => {
    if (!suggestions.length) return;

    const acceptedTasks = suggestions.filter((t) => t.accepted === true);
    const unacceptedTasks = suggestions.filter((t) => t.accepted !== true);

    // Regenerate unaccepted tasks
    const newSuggestions = generateSafeSuggestions(unacceptedTasks, classes, acceptedTasks, today);

    setSuggestions([...acceptedTasks, ...newSuggestions]);

    // Update accepted tasks in MongoDB (just to make sure times are synced)
    await Promise.all(
      acceptedTasks.map((t) =>
        fetch(`/api/tasks/${t.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start: t.start, end: t.end, duration: t.duration }),
        })
      )
    );
  };

  const totalTime = suggestions.reduce(
    (acc, t) => {
      acc.m += t.duration;
      acc.h += Math.floor(acc.m / 60);
      acc.m %= 60;
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
