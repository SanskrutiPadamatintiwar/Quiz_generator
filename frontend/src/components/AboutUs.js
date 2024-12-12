import React from 'react';
import navimg from '../navImg.jpg';
const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r  px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-6 animate-fadeIn">About Us</h1>
      <p className="text-lg text-white text-center subpixel-antialiased max-w-2xl mb-8">
        We are a dedicated team of developers passionate about creating interactive, educational, and engaging experiences for users.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-64 h-64  rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
        style={{ backgroundImage: `url(${navimg})` }}>
          <h2 className="text-xl font-semibold text-white mb-2">Our Mission</h2>
          <p className="text-white">
            Our mission is to make learning accessible and enjoyable for everyone, by leveraging modern technology and design.
          </p>
        </div>
        <div className="w-64 h-64 bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
        style={{ backgroundImage: `url(${navimg})` }}>
          <h2 className="text-xl font-semibold text-white mb-2">Our Values</h2>
          <p className="text-white">
            We believe in quality, innovation, and constant improvement to deliver the best experience for our users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
