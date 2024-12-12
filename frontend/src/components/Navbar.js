import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, InformationCircleIcon, PhoneIcon } from '@heroicons/react/outline';
import navImg from '../navImg.jpg';

const Navbar = () => {
  return (
    <nav
      className="flex justify-between items-center bg-transparent backdrop-blur-md fixed inset-x-0 h-16 md:px-5 md:py-4 bg-gradient-to-r  "
    >
    {/* <nav
      className="flex justify-between items-center p-6 md:p-8 bg-gradient-to-r from-sky-900 to-sky-700 shadow-xl hover:from-sky-800 hover:to-sky-600 background-repeat "
       style={{ backgroundImage: `url(${navImg})` }} 
    > */}
    
      
      <h1 className="text-white font-bold text-3xl hover:text-sky-300 transition duration-300 cursor-pointer">
        QuizApp
      </h1>
      <ul className="flex space-x-8 text-white font-semibold">
        <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/">
          <HomeIcon className="h-4 w-6 mr-0" />
          Home
        </Link>
        <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/quiz">
          <BookOpenIcon className="h-4 w-6 mr-0" />
          
          Quiz
        </Link>
        <Link className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm" to="/about">
          <InformationCircleIcon className="h-4 w-6 mr-0" />
          About
        </Link>
        <li className="flex items-center hover:text-sky-300 transition duration-300 cursor-pointer text-sm">
          <PhoneIcon className="h-4 w-6 mr-0" />
          Contact
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;



