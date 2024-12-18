import React from "react";
import navimg from "../navImg.jpg"; // Use your image or placeholder

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r px-6 py-10 pt-20"> {/* Added pt-20 */}
      <h1 className="text-4xl font-bold text-white mb-6 animate-fadeIn">
        Contact Us
      </h1>
      <p className="text-lg text-white text-center subpixel-antialiased max-w-2xl mb-8">
        Feel free to reach out to us! We’re here to help with any inquiries or support you need.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {/* Contact 1 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-xl font-semibold text-white mb-2"> Chaitanya Gattu</h2>
          <p className="text-white">
            <strong>Email:</strong> chaitanyagattu04@gmail.com
          </p>
          <p className="text-white">
            <strong>GitHub Link:</strong> https://github.com/Chaitanya16050
          </p>
        </div>

        {/* Contact 2 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Devarashetty Nandini</h2>
          <p className="text-white">
            <strong>Email:</strong> nandinidevarashetty@gmail.com
          </p>
          <p className="text-white">
            <strong>GitHub Link:</strong> https://github.com/Nandini42
          </p>
        </div>

        {/* Contact 3 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Dhanya Sri Kokku</h2>
          <p className="text-white">
            <strong>Email:</strong> dhanyasri120805@gmail.com
          </p>
          <p className="text-white">
            <strong>GitHub Link:</strong> https://github.com/Dhanya120805
          </p>
        </div>

        {/* Contact 4 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Mandadapu Pooja</h2>
          <p className="text-white">
            <strong>Email:</strong> mandadapupooja1817@gmail.com
          </p>
          <p className="text-white">
            <strong>GitHub Link:</strong> https://github.com/pooja01817
          </p>
        </div>

        {/* Contact 5 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Bharath Shashank</h2>
          <p className="text-white">
            <strong>Email:</strong> bharatsashankreddy04@gmail.com
          </p>
          <p className="text-white">
            <strong>GitHub Link:</strong> https://github.com/bharatredd17
          </p>
        </div>

        {/* Contact 6 */}
        <div
          className="w-1/4 h-64 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${navimg})` }}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Padamatintiwar Sanskruti</h2>
          <p className="text-white">
            <strong>Email:</strong> spadamatintiwar@gmail.com
          </p>
          <p className="text-white">
            <strong>GitHub Link:</strong> https://github.com/SanskrutiPadamatintiwar
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
