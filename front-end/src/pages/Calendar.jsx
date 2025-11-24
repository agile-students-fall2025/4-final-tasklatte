import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import { useNavigate } from "react-router-dom";
import "./Calendar.css"; 
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import AddTask from "./AddTasks.jsx";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDayClick = (value) => {
    const formattedDate = value.toISOString().split("T")[0];
    navigate(`/daily-tasks/${formattedDate}`);
  };

  const handleAddTask = () => {
    navigate("/calendar/new");
  };

  const handleAddClass = () => {
    navigate("/calendar/add-class");
  };

  return (
    <div className="calendar-container">
      <HeaderBar
        title="Calendar" 
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />
      {/* <h1 className="calendar-title">Calendar</h1> */}

      <div className="calendar-wrapper">
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDayClick}
        />
      </div>

      {/* <button className="add-task-button">Add Task</button> */}
      <button className="add-task-button" onClick={() => navigate("/calendar/new")}>
        Add Task
      </button>
      <button className="add-class-button" onClick={handleAddClass}>
        Add Class
      </button>
      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}


