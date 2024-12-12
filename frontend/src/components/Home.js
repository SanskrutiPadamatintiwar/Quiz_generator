import React from 'react';
import navImg from '../navImg.jpg'; // adjust path if needed
import { HomeIcon } from '@heroicons/react/solid';
import qimg from '../qImg.jpg';

// 
const Home = () => {
  return (
   
     <div
      className="  mx-auto mt-12 max-w-3xl flex items-center justify-center"
      // style={{ backgroundImage: `url(${navImg})` }}  from-cyan-600 to-cyan-900
    > 
      <div className="text-center text-white py-20 bg-opacity-75 flex flex-col items-center justify-center "
      // className="text-center text-white p-20 bg-opacity-75 rounded-lg shadow-lg" style={{ backgroundImage: `url(${navImg})` }}>
        >
        <h1 className="text-5xl font-bold tracking-tighter mb-4">Test Your Knowledge Instantly With Our{'  '}
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-purple-300 to-blue-400"> Quiz App </span>
</h1>
        <p className="text-lg text-muted-foreground max-w-prose text-center ">
        Type in any topic you're curious about, and dive into a quiz instantly. Quick, fun, and a great way to learn something new. Ready to attempt? Jump into your first quiz now!
        </p>
        <button className="mt-6 px-8 py-2 bg-gradient-to-r text-gray-900 from-teal-100 via-purple-200 to-blue-300 hover:bg-sky-950 rounded-full  font-semibold transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;






