import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DailyTasks from "./DailyTasks.jsx";
import Placeholder from "./Placeholder.jsx";
import Settings from "./Settings.jsx";
import AllTasks from "./AllTasks.jsx";
import CalendarPage from "./Calendar.jsx";
import AddTask from "./AddTasks.jsx";
import AddClass from "./AddClass.jsx";
import EditClass from "./EditClass.jsx";
import ChangeBio from "./ChangeBio.jsx";
import Profile from "./profilePage.jsx";
import EditTask from "./EditTask.jsx";
import ChangeMajor from "./ChangeMajor.jsx";
import ChangeSchool from "./ChangeSchool.jsx";
import AiSuggestions from "./AISuggestions.jsx";
import Home from "./homePage.jsx";
import ChangeTimezone from "./ChangeTimezone.jsx";
import Login from "./loginPage.jsx";
import Goals from "./Goals.jsx";
import Register from "./registerPage.jsx";
import Dashboard from "./dashboardPage.jsx";

const fmtLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function TodayRedirect() {
  return <Navigate to={`/daily-tasks/${fmtLocalDate(new Date())}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/all" element={<AllTasks />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/new" element={<AddTask />} />
        <Route path="/calendar/add-class" element={<AddClass />} />

        <Route path="/daily" element={<TodayRedirect />} />
        <Route path="/daily-tasks/:date" element={<DailyTasks />} />
        <Route path="/classes/:id/edit" element={<EditClass />} />

        <Route path="/tasks/:id/edit" element={<EditTask title="Edit Task" />} />

        <Route path="/AISuggestions" element={<AiSuggestions />} />
        <Route path="/profilePage" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/bio" element={<ChangeBio />} />
        <Route path="/settings/major" element={<ChangeMajor />} />
        <Route path="/settings/school" element={<ChangeSchool />} />
        <Route path="/settings/timezone" element={<ChangeTimezone />} />
        <Route path="/settings/goals" element={<Goals />} />

        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
