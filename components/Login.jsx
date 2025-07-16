import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+91",
    password: "",
  });
  
  // Error and loading state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Check phone number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    
    // Check country code
    if (!formData.countryCode) {
      newErrors.countryCode = "Country code is required";
    }
    
    // Check password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get users from backend
      const response = await fetch("http://localhost:3001/users");
      
      if (!response.ok) {
        throw new Error("Failed to connect to server");
      }
      
      const users = await response.json();
      
      // Find matching user
      const user = users.find(u => 
        u.countryCode === formData.countryCode &&
        u.phoneNumber === formData.phoneNumber &&
        u.password === formData.password
      );
      
      if (user) {
        // Login successful - store user data in localStorage
        const userDataToStore = {
          id: user.id,
          fullName: user.fullName,  // Changed from 'name' to 'fullName'
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          status: user.status,
          // Don't store password in localStorage for security
          loginTime: new Date().toISOString(),
          isLoggedIn: true
        };
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(userDataToStore));
        
        // Optional: Store login status separately for quick checks
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log("Login successful:", user);
        console.log("User data stored in localStorage");
        
        navigate("/home");
      } else {
        // User not found or wrong password
        setErrors({
          general: "User not found or incorrect password"
        });
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Login failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4 relative">
        <span className="relative text-[#2a586f] z-10">Login</span>
         <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fac167] z-0"></div>
        </h1>

      {/* Form Container */}
      <div className="w-full max-w-96 bg-white rounded-lg shadow-sm p-8">
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {/* Phone Number Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            
            <div className="flex gap-2">
              {/* Country Code */}
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-20 h-11 border border-gray-300 rounded-md px-2 text-sm"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              
              {/* Phone Number */}
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="flex-1 h-11 border border-gray-300 rounded-md px-3 text-sm"
              />
            </div>
            
            {/* Phone Number Error */}
            {errors.phoneNumber && (
              <div className="text-sm text-red-600">{errors.phoneNumber}</div>
            )}
          </div>

          {/* Password Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full h-11 border border-gray-300 rounded-md px-3 text-sm"
            />
            
            {/* Password Error */}
            {errors.password && (
              <div className="text-sm text-red-600">{errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2a586f] hover:bg-slate-700 text-white rounded-md py-2 px-3 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Register Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}