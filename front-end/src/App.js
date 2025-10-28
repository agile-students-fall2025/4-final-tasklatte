// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DailyTasks from "./pages/DailyTasks.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Settings from "./Settings.js";
import AllTasks from "./pages/AllTasks.jsx";
import CalendarPage from "./Calendar.js";
import AddTask from "./pages/AddTasks.jsx";
import ChangeBio from "./ChangeBio.js";
import Profile from "./profilePage.js";
import EditTask from "./pages/EditTask.jsx";
import ChangeMajor from './ChangeMajor.js';
import ChangeSchool from './ChangeSchool.js';



export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/all" element={<AllTasks />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/daily" element={<DailyTasks />} />
        <Route path="/calendar/new" element={<AddTask />} />
        {/* <Route path="/daily" element={<Navigate to="/daily" replace />} /> */}
        <Route path="/calendar" element={<Placeholder title="Calendar" />} />
        <Route path="/ai" element={<Placeholder title="AI Suggestions" />} />
        <Route path="/profilePage" element={<Profile />} />
        {/* <Route path="/all" element={Wrap(<Placeholder title="All Tasks" />)} />
        <Route path="/account" element={Wrap(<Placeholder title="Account" />)} /> */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks/:id/edit" element={<EditTask title="Edit Task (stub)" />} />
        <Route path='/settings/bio' element={<ChangeBio />} />
        <Route path='/settings/major' element={<ChangeMajor />} />
        <Route path='/settings/school' element={<ChangeSchool />} />
        <Route path="/tasks/:id/edit" element={<Placeholder title="Edit Task (stub)" />} />
        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
