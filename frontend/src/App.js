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
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";


function App() {
  const isLoggedIn = (localStorage.getItem("token") != null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className="bg-no-repeat bg-cover bg-center min-h-screen relative flex flex-col " style={{ backgroundImage: `url(${qimg})` }}>
      <Navbar />
      {isLoggedIn && (
        <button 
          onClick={handleLogout} 
          className="absolute top-4 right-20 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/questions" element={<Questions />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
