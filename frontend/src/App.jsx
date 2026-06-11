import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ResumeAnalysis from "./pages/ResumeAnalysis";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <div className="container">

        <Routes>

          <Route
            path="/"
            element={<ResumeAnalysis />}
          />

          <Route
            path="/interview"
            element={<Interview />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/summary"
            element={<Summary />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;