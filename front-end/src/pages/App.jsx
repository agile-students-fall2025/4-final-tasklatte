import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";

import DailyTasks from "./DailyTasks.jsx";
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
import Account from "./Account.jsx";
import NotFound from "./NotFound.jsx";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} /> 
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/all" 
          element={
            <PrivateRoute>
              <AllTasks />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/calendar" 
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/calendar/new" 
          element={
            <PrivateRoute>
              <AddTask />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/calendar/add-class" 
          element={
            <PrivateRoute>
              <AddClass />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/daily" 
          element={
            <PrivateRoute>
              <TodayRedirect />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/daily-tasks/:date" 
          element={
            <PrivateRoute>
              <DailyTasks />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/classes/:id/edit" 
          element={
            <PrivateRoute>
              <EditClass />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/tasks/:id/edit" 
          element={
            <PrivateRoute>
              <EditTask />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/AISuggestions" 
          element={
            <PrivateRoute>
              <AiSuggestions />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/profilePage" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/settings/bio" 
          element={
            <PrivateRoute>
              <ChangeBio />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/settings/major" 
          element={
            <PrivateRoute>
              <ChangeMajor />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/settings/school" 
          element={
            <PrivateRoute>
              <ChangeSchool />
            </PrivateRoute>
          } 
        />

        {/* <Route 
          path="/settings/timezone" 
          element={
            <PrivateRoute>
              <ChangeTimezone />
            </PrivateRoute>
          } 
        /> */}

        <Route 
          path="/settings/goals" 
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/account" 
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
