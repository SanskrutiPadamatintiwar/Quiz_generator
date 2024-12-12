import logo from "./logo.svg";
import qimg from "./qImg.jpg";
import navimg from "./navImg.jpg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import QuizPage from "./components/QuizPage";
import AboutUs from "./components/AboutUs";
import Questions from "./components/Questions";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  
  return (
    <Router>
    <div className="bg-no-repeat bg-cover bg-center min-h-screen relative flex flex-col " style={{ backgroundImage: `url(${qimg})` }}>
     
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<QuizPage />}/>
      <Route path="/about" element={<AboutUs />} />
      <Route path="/questions" element={<Questions />} />
      </Routes>
      {/* <Home/> */}
    </div>

    </Router>
  );
}

export default App;
