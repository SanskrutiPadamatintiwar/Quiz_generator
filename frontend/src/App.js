import logo from "./logo.svg";
import qimg from "./qImg.jpg";
import navimg from "./navImg.jpg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import QuizPage from "./components/QuizPage";
import AboutUs from "./components/AboutUs";
import Questions from "./components/Questions";
import Login from "./components/login";
import Signup from "./components/Signup";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";


function App() {
  const isLoggedIn = (localStorage.getItem("token") != null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate('/login');
  };

  return (
    // <div className="bg-no-repeat bg-cover bg-center min-h-screen relative flex flex-col " style={{ backgroundImage: `url(${qimg})` }}>
    <div className="bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 min-h-screen flex flex-col relative z-20">
      {isLoggedIn && <Navbar />}
      
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
