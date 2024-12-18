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
import ResponeSheet from "./components/ResponseSheet"
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
      {/* {isLoggedIn && (
        <button 
          onClick={handleLogout} 
          className="absolute top-4 right-20 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button> */}
      {/* )} */}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/response-sheet" element={<ResponeSheet />} />
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
