import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ResumeAnalysis from "./pages/ResumeAnalysis";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <div className="container">

        <Routes>

          <Route

            path="/login"

            element={<Login />}

          />

          <Route

            path="/register"

            element={<Register />}

          />

          <Route

            path="/"

            element={

              <ProtectedRoute>

                <ResumeAnalysis />

              </ProtectedRoute>

            }

          />

          <Route

            path="/interview"

            element={

              <ProtectedRoute>

                <Interview />

              </ProtectedRoute>

            }

          />

          <Route

            path="/dashboard"

            element={

              <ProtectedRoute>

                <Dashboard />

              </ProtectedRoute>

            }

          />

          <Route

            path="/summary"

            element={

              <ProtectedRoute>

                <Summary />

              </ProtectedRoute>

            }

          />

        </Routes>

      </div>

    </BrowserRouter>

  );

}

export default App;