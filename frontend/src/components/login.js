import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../communicators/apicommunicators'; // Import signup function
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../assets/image.jpg'; // Update the path to match your image location

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignup) {
      try {
        const response = await login(formData);
        if (response?.status === 200) {
          localStorage.setItem("token", response.data.data);
          if (!toast.isActive("login-success")) {
            toast.success("Logged in successfully", { toastId: "login-success" });
          }
          onLogin();
          navigate('/');
        } else {
          toast.error(response?.data?.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("An error occurred during login.");
      }
    } else {
      try {
        const response = await signup(formData);
        if (response?.status === 200) {
          toast.success("Signed up successfully");
          setIsSignup(false);
        } else {
          toast.error(response?.data?.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("An error occurred during signup.");
      }
    }
  };

  const toggleForm = () => {
    // setIsSignup(!isSignup);
    navigate('/signup');

  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      // style={{
      //   backgroundImage: `url(${backgroundImage})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-80">
        {/* <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">QUIZ APP</h1> */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{isSignup ? 'Sign Up' : 'Log In'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-950 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"} 
          <button onClick={toggleForm} className="text-slate-500 hover:underline">
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
