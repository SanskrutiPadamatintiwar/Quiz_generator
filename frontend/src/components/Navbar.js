import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, InformationCircleIcon, PhoneIcon } from '@heroicons/react/outline';
import navImg from '../navImg.jpg';

const Navbar = () => {
  const isLoggedIn = (localStorage.getItem("token") != null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav
      className="flex justify-between items-center bg-transparent backdrop-blur-lg fixed inset-x-0 h-16 md:px-5 md:py-4 bg-gradient-to-r"
    >
      <h1 className="text-white font-bold text-3xl hover:text-sky-300 transition duration-300 cursor-pointer">
        QuizApp
      </h1>
      <ul className="flex space-x-8 text-white font-semibold">
        <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/">
          <HomeIcon className="h-4 w-6 mr-0" />
          Home
        </Link>
        {/* <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/quiz">
          <BookOpenIcon className="h-4 w-6 mr-0" />
          Quiz
        </Link> */}
        <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/about">
          <InformationCircleIcon className="h-4 w-6 mr-0" />
          About
        </Link>
        <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/contact">
          <PhoneIcon className="h-4 w-6 mr-0" />
          Contact
        </Link>
        {isLoggedIn && (
          <button 
            onClick={handleLogout} 
            className="bg-white text-slate-800 py-1 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;



