import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DailyTasks from "./pages/DailyTasks.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Settings from "./Settings.js";
import AllTasks from "./pages/AllTasks.jsx";
import CalendarPage from "./Calendar.jsx";
import AddTask from "./pages/AddTasks.jsx";
import ChangeBio from "./ChangeBio.js";
import Profile from "./profilePage.js";
import EditTask from "./pages/EditTask.jsx";
import ChangeMajor from "./ChangeMajor.js";
import ChangeSchool from "./ChangeSchool.js";
import AiSuggestions from "./AISuggestions.js";
import Home from "./homePage.js";
import ChangeTimezone from "./ChangeTimezone.js";
import Login from "./loginPage.js";
import Goals from "./Goals.js";
import Register from "./registerPage.js";
import Dashboard from "./dashboardPage.js";

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

        <Route path="/daily" element={<TodayRedirect />} />
        <Route path="/daily-tasks/:date" element={<DailyTasks />} />

        <Route path="/tasks/:id/edit" element={<EditTask title="Edit Task" />} />

        <Route path="/AISuggestions" element={<AiSuggestions />} />
        <Route path="/profilePage" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/bio" element={<ChangeBio />} />
        <Route path="/settings/major" element={<ChangeMajor />} />
        <Route path="/settings/school" element={<ChangeSchool />} />
        <Route path="/settings/time" element={<ChangeTimezone />} />
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
