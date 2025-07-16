import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const [accepted, setAccepted] = useState(false)
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (!accepted) {
      setShowError(true)
      return
    }
    // If accepted, go to login page
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 mt-32 md:mt-10">
        <div className="text-center max-w-7xl w-full relative">
          <h1 className="text-[30px] md:text-[70px] font-bold tracking-wide z-50 text-[#313131]">
            Welcome to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">TSEEP Mastery Box</span>
              <div className="absolute bottom-2 md:bottom-6 left-0 w-full h-3 bg-[#fac167] z-0"></div>
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-16">
            Unlock your potential with{" "}
            <span className="font-semibold text-black">AI inspired tool</span>
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between max-w-7xl mx-auto w-full border-t border-gray-200 gap-5 md:gap-0">
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-3 md:items-start">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked)
                if (e.target.checked) setShowError(false)
              }}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-gray-700 text-sm leading-relaxed cursor-pointer max-w-md"
            >
              I confirm that I have read and accept the terms and conditions and privacy policy.
            </label>
          </div>
          {showError && (
            <span className="text-red-600 text-sm mt-1">
              Please agree to the terms to continue.
            </span>
          )}
        </div>

        <button
          onClick={handleGetStarted}
          className={`${
            accepted ? 'bg-[#2a586f] ' : 'bg-gray-400 cursor-not-allowed'
          } text-white px-10 py-2 text-[14px] rounded-xl transition`}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Landing
