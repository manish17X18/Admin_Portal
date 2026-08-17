import React, { useState, useRef } from 'react';
import image from '../assets/lock.png';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/Signin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import ReCAPTCHA from "react-google-recaptcha";
import api from './Api';

const SignIn = () => {
  const { isLoggedIn } = useSelector((state) => state.signin);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [captchaToken, setCaptchaToken] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // const recaptchaRef = useRef(null); 
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // 3. Prevent submit if captcha isn't checked
    // if (!captchaToken) {
    //   toast.error("Please complete the reCAPTCHA verification!");
    //   return;
    // }

    setLoading(true);

    try {
      // 4. Send captchaToken in body
      const response = await api.post('/api/v1/login', {
        email,
        password,
        // captchaToken,
      });

      if (response.data?.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        dispatch(login(response.data.user));

        toast.success(response.data.message || 'Logged in successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });

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

      // 5. Reset captcha on failed login
      // recaptchaRef.current?.reset();
      // setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  // function onChange(value) {
  //   setCaptchaToken(value);
  // }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-b from-[#6B9DFE] via-[#82B1FF] to-[#A2DBFF] p-4">
      <div className="w-full max-w-105 bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        <div className="flex justify-center mb-4 mt-2">
          <img
            src={image}
            alt="lock-image"
            className="h-16 w-16 object-contain hover:cursor-pointer"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <span className="text-sm text-gray-500 font-medium block mt-1">
            Sign In to your account
          </span>
        </div>

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

          {/* ReCAPTCHA */}
          {/* <div className="flex flex-col items-center gap-2 pt-1">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "YOUR_SITE_KEY_HERE"}
              onChange={onChange}
            />
            <div className="w-full text-right">
              <span className="text-xs font-semibold text-[#8B88FF] hover:underline hover:cursor-pointer">
                Forgot Password?
              </span>
            </div>
          </div> */}

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