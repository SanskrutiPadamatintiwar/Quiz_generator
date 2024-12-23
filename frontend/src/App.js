import logo from "./logo.svg";
import qimg from "./qImg.jpg";
import navimg from "./navImg.jpg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import QuizPage from "./components/QuizPage";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import Questions from "./components/Questions";
import Login from "./components/login";
import Signup from "./components/Signup";
import ResponeSheet from "./components/ResponseSheet"

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const isLoggedIn = (localStorage.getItem("token") != null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 min-h-screen flex flex-col relative z-20">
      {isLoggedIn && <Navbar />}
      <ToastContainer />
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />}/>
            <Route path="/questions" element={<Questions />} />
            <Route path="/response-sheet" element={<ResponeSheet />} />
            {/* <Route path="/generated-questions" element={<GeneratedQuestionsPage />} /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login onLogin={() => toast.success("Logged in successfully")} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
