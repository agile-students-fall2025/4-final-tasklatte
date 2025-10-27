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
import Placeholder from "./pages/EditTask.jsx";
import Settings from "/Users/manrongmao/4-final-tasklatte/front-end/src/Settings.js";




export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DailyTasks />} />
        <Route path="/daily" element={<Navigate to="/" replace />} />
        <Route path="/calendar" element={<Placeholder title="Calendar" />} />
        <Route path="/ai" element={<Placeholder title="AI Suggestions" />} />
        {/* <Route path="/profile" element={Wrap(<Placeholder title="Profile" />)} />
        <Route path="/all" element={Wrap(<Placeholder title="All Tasks" />)} />
        <Route path="/account" element={Wrap(<Placeholder title="Account" />)} /> */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks/:id/edit" element={<Placeholder title="Edit Task (stub)" />} />
        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
