import React from "react";
import navimg from "../navImg.jpg"; // Use your image or placeholder
import { GitHubIcon,gmailIcon } from '@heroicons/react/outline';

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r px-6 py-10 pt-20">
      <h1 className="text-4xl font-bold text-white mb-6 animate-fadeIn">
        Contact Us
      </h1>
      <p className="text-lg text-white text-center subpixel-antialiased max-w-2xl mb-8">
        Feel free to reach out to us! We’re here to help with any inquiries or support you need.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {/* Contact 1 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center text-center"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-lg font-semibold text-white mb-2">Chaitanya Gattu</h2>
          <p className="text-sm text-white">
            <strong>Email:</strong> <a href="mailto:chaitanyagattu04@gmail.com" className="underline">chaitanyagattu04@gmail.com</a>
          </p>
          <p className="text-sm text-white">
            <strong>GitHub Link:</strong> <a href="https://github.com/Chaitanya16050" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/Chaitanya16050</a>
          </p>
        </div>

        {/* Contact 2 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center text-center"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-lg font-semibold text-white mb-2">Devarashetty Nandini</h2>
          <p className="text-sm text-white">
            <strong>Email:</strong> <a href="mailto:nandinidevarashetty@gmail.com" className="underline">nandinidevarashetty@gmail.com</a>
          </p>
          <p className="text-sm text-white">
            <strong>GitHub Link:</strong> <a href="https://github.com/Nandini42" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/Nandini42</a>
          </p>
        </div>

        {/* Contact 3 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${navimg})` }}>
          <h2 className="text-lg font-semibold text-white mb-2">Dhanya Sri Kokku</h2>
          <p className="text-sm text-white">
            <strong>Email:</strong> <a href="mailto:dhanyasri120805@gmail.com" className="underline">dhanyasri120805@gmail.com</a>
          </p>
          <p className="text-sm text-white">
            <strong>GitHub Link:</strong> <a href="https://github.com/Dhanya120805" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/Dhanya120805</a>
          </p>
        </div>

        {/* Contact 4 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center text-center"
       style={{ backgroundImage: `url(${navimg})` }} >
          <h2 className="text-lg font-semibold text-white mb-2">Mandadapu Pooja</h2>
          <p className="text-sm text-white">
            <strong>Email:</strong> <a href="mailto:mandadapupooja1817@gmail.com" className="underline">mandadapupooja1817@gmail.com</a>
          </p>
          <p className="text-sm text-white">
            <strong>GitHub Link:</strong> <a href="https://github.com/pooja01817" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/pooja01817</a>
          </p>
        </div>

        {/* Contact 5 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${navimg})` }}>
          <h2 className="text-lg font-semibold text-white mb-2">Bharath Shashank</h2>
          <p className="text-sm text-white">
            <strong>Email:</strong> <a href="mailto:bharatsashankreddy04@gmail.com" className="underline">bharatsashankreddy04@gmail.com</a>
          </p>
          <p className="text-sm text-white">
            <strong>GitHub Link:</strong> <a href="https://github.com/bharatredd17" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/bharatredd17</a>
          </p>
        </div>

        {/* Contact 6 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${navimg})` }}>
          <h2 className="text-lg font-semibold text-white mb-2">Padamatintiwar Sanskruti</h2>
          <p className="text-sm text-white">
            <strong>Email:</strong> <a href="mailto:spadamatintiwar@gmail.com" className="underline">spadamatintiwar@gmail.com</a>
          </p>
          <p className="text-sm text-white">
            <strong>GitHub Link:</strong> <a href="https://github.com/SanskrutiPadamatintiwar" target="_blank" rel="noopener noreferrer" className="underline">https://github.com/SanskrutiPadamatintiwar</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
