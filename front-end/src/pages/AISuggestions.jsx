import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AISuggestions.css";

const API_BASE = process.env.REACT_APP_API_URL || "";

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

const fmtLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// --- Busy Minutes ---
const buildBusyMinutes = (classes, otherTasks, today) => {
  const busy = new Array(24 * 60).fill(false);

  const todayDate = today instanceof Date ? today : new Date(today);
  const todayIndex = todayDate.getDay();

  const safeClasses = Array.isArray(classes) ? classes : [];
  const safeOtherTasks = Array.isArray(otherTasks) ? otherTasks : [];

  safeClasses.forEach((c) => {
    if (!c.days || !Array.isArray(c.days)) return;
    if (!c.startTime || !c.endTime) return;

    if (c.days.includes(todayIndex)) {
      const start = timeToMinutes(c.startTime);
      const end = timeToMinutes(c.endTime);
      for (let m = start; m < end; m++) busy[m] = true;
    }
  });

  safeOtherTasks.forEach((t) => {
    if (!t.start || !t.end) return;
    const start = timeToMinutes(t.start);
    const end = timeToMinutes(t.end);
    for (let m = start; m < end; m++) busy[m] = true;
  });

  return busy;
};

const findFreeBlock = (busy, duration, dayStart = 480, dayEnd = 1320) => {
  for (let i = dayStart; i <= dayEnd - duration; i++) {
    let canFit = true;
    for (let j = 0; j < duration; j++) {
      if (busy[i + j]) {
        canFit = false;
        i += j;
        break;
      }
    }
    if (canFit) return i;
  }
  return null;
};

const generateSafeSuggestions = (tasks, classes, otherTasks, today) => {
  const suggestions = [];
  const busy = buildBusyMinutes(classes, otherTasks, today);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  safeTasks.forEach((task) => {
    const deadline = task.deadline
      ? new Date(task.deadline)
      : null;

    let deadlineMinutes = null;

    if (deadline) {
      deadlineMinutes =
        deadline.getHours() * 60 + deadline.getMinutes(); 
    }

    let startMin = null;

    for (let minute = 480; minute <= 1320 - task.duration; minute++) {
      if (deadlineMinutes != null && minute + task.duration > deadlineMinutes) {
        break;
      }

      let canFit = true;
      for (let j = 0; j < task.duration; j++) {
        if (busy[minute + j]) {
          canFit = false;
          minute += j;
          break;
        }
      }

      if (canFit) {
        startMin = minute;
        break;
      }
    }

    if (startMin !== null) {
      const startTime = minutesToTime(startMin);
      const endTime = addTime(startTime, task.duration);

      suggestions.push({
        ...task,
        start: startTime,
        end: endTime,
      });

      for (let m = startMin; m < startMin + task.duration; m++) {
        busy[m] = true;
      }
    } else {
      suggestions.push({
        ...task,
        start: "(not applicable) try again to find better",
        end: "",
      });
    }
  });

  return suggestions;
};


// --- Component ---
export default function AiSuggestions() {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const todayDate = new Date();
  const todayStr = fmtLocalDate(todayDate);

  // --- Load daily tasks & classes ---
  const loadDailyTasks = useCallback(async () => {
    try {
      const [classRes, taskRes] = await Promise.all([
        fetch(`${API_BASE}/api/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/tasks?date=${todayStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const classData = await classRes.json();
      setClasses(Array.isArray(classData) ? classData : []);

      const tasks = await taskRes.json();
      const safeTasks = Array.isArray(tasks) ? tasks : [];

      const dailyTasks = safeTasks.map((t) => ({
        id: t._id,
        task: t.title,
        duration: t.duration || randomDuration(30, 120),
        deadline: t.date
      }));

      const safeSuggestions = generateSafeSuggestions(
        dailyTasks,
        classData,
        [], 
        todayDate
      );
      setSuggestions(safeSuggestions);
    } catch (err) {
      console.error("Failed to load daily tasks:", err);
    }
  }, [todayStr, token]);

  useEffect(() => {
    loadDailyTasks();
  }, [loadDailyTasks]);


  const handleDecline = (id) => {
    const declinedTask = suggestions.find((s) => s.id === id);
    if (!declinedTask) return;


    const otherTasks = suggestions.filter((t) => t.id !== id);

    const taskToRegenerate = {
      ...declinedTask,
      start: undefined,
      end: undefined,
      duration: randomDuration(30, 120),
    };

    const regenerated = generateSafeSuggestions(
      [taskToRegenerate],
      classes,
      otherTasks,
      todayDate
    )[0];

    setSuggestions((prev) =>
      prev.map((t) => (t.id === id ? regenerated : t))
    );
  };

  const totalTime = suggestions.reduce(
    (acc, t) => {
      acc.m += t.duration || 0;
      acc.h += Math.floor(acc.m / 60);
      acc.m %= 60;
      return acc;
    },
    { h: 0, m: 0 }
  );

  return (
    <div className="page">
      <HeaderBar title="AI Suggestions" onHamburger={() => setMenuOpen(true)} onLogo={() => navigate("/dashboard")}/>

      <main className="suggestions-main">
        <div className="blurb pixel-font">
          <p>Here’s the best order to complete your tasks today before the deadline</p>
          <p>
            You’ll need {totalTime.h}h {totalTime.m}m
          </p>
        </div>

        <div className="suggestions-list">
          {suggestions.map((t) => (
            <div key={t.id} className="suggestion-card pixel-frame">
              <p className="pixel-font task">{t.task}</p>
              <p className="pixel-font time">
                {t.start} - {t.end} (
                {Math.floor((t.duration || 0) / 60)}h {(t.duration || 0) % 60}m)
              </p>

              <div className="decision-buttons">
                <button
                  className="pixel-button decline"
                  onClick={() => handleDecline(t.id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
