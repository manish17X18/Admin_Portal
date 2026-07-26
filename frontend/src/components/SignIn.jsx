import React from 'react'
import image from '../assets/lock.png'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../features/Signin'

const SignIn = () => {
  const { isLoggedIn } = useSelector((state) => state.signin)
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submitHandler(e) {
    e.preventDefault()
    console.log({ email, password })
    console.log(isLoggedIn)
    dispatch(login())
    console.log(isLoggedIn)
    setEmail('')
    setPassword('')
  }

  //go to dashbord page after sign in
  //connect with backend

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
                  type="password"
                  required
                  className="w-full h-12 pl-4 pr-11 border border-gray-200 rounded-2xl text-gray-700 bg-white placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Visual Eye Icon matching design */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
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
            className="w-full h-12 bg-[#3B82F6] hover:bg-blue-600 rounded-2xl text-white font-semibold text-base transition-all duration-200 hover:cursor-pointer shadow-md active:scale-[0.98] mt-2 flex items-center justify-center"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn