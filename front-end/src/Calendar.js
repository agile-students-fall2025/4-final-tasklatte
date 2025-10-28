import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import { useNavigate } from "react-router-dom";
import "./Calendar.css"; 

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDayClick = (value) => {
    const formattedDate = value.toISOString().split("T")[0];
    navigate(`/daily-tasks/${formattedDate}`);
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Calendar</h1>

      <div className="calendar-wrapper">
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDayClick}
        />
      </div>

      <button className="add-task-button">Add Task</button>
    </div>
  );
}


