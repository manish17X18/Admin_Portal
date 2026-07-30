import React, { useState } from 'react';
import image from '../assets/lock.png';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/Signin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const SignIn = () => {
  const { isLoggedIn } = useSelector((state) => state.signin);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call Express login API
      const response = await axios.post('http://localhost:5000/api/v1/login', {
        email,
        password,
      });

      if (response.data?.success) {
        // 2. Save JWT Token and User Profile in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));

        // 3. Set default Authorization Header for all subsequent API requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // 4. Update Redux store
        dispatch(login(response.data.user));

        toast.success(response.data.message || 'Logged in successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });

        // 5. Reset inputs & Navigate to Users dashboard
        setEmail('');
        setPassword('');
        navigate('/users');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to log in. Please check your credentials.';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-b from-[#6B9DFE] via-[#82B1FF] to-[#A2DBFF] p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-105 bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        
        {/* Lock Image */}
        <div className="flex justify-center mb-4 mt-2">
          <img
            src={image}
            alt="lock-image"
            className="h-16 w-16 object-contain hover:cursor-pointer"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <span className="text-sm text-gray-500 font-medium block mt-1">
            Sign In to your account
          </span>
        </div>

        {/* Inputs Section */}
        <form onSubmit={submitHandler} className="w-full space-y-5">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-1.5">
              Email
              <input
                type="email"
                required
                className="w-full h-12 px-4 border border-gray-200 rounded-2xl text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm mt-1"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-1.5 relative">
              Password
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full h-12 pl-4 pr-11 border border-gray-200 rounded-2xl text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Password Toggle Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5" />
                  )}
                </button>
              </div>
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right pt-1">
            <span className="text-xs font-semibold text-[#8B88FF] hover:underline hover:cursor-pointer">
              Forgot Password?
            </span>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#3B82F6] hover:bg-blue-600 rounded-2xl text-white font-semibold text-base transition-all duration-200 hover:cursor-pointer shadow-md active:scale-[0.98] mt-2 flex items-center justify-center disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;