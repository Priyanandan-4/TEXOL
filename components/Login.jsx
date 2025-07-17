import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  // Hardcoded credentials
  const hardcodedCredentials = {
    phoneNumber: "0987654321",
    password: "texol123",
    countryCode: "+91",
    fullName: "Guest User",
    email: "guest@example.com",
    id: "guest-001",
    status: "active"
  };

  // Country options
  const countries = [
    { code: "+91", label: "India", flag: "/image/india.png" },
    { code: "+1", label: "United States", flag: "/image/us.png" },
    { code: "+44", label: "United Kingdom", flag: "/image/dg.png" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+91",
    password: "",
  });

  // Error and loading state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.countryCode) {
      newErrors.countryCode = "Country code is required";
    }

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

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check hardcoded credentials first
      if (
        formData.phoneNumber === hardcodedCredentials.phoneNumber &&
        formData.password === hardcodedCredentials.password &&
        formData.countryCode === hardcodedCredentials.countryCode
      ) {
        const userDataToStore = {
          id: hardcodedCredentials.id,
          fullName: hardcodedCredentials.fullName,
          email: hardcodedCredentials.email,
          phoneNumber: hardcodedCredentials.phoneNumber,
          countryCode: hardcodedCredentials.countryCode,
          status: hardcodedCredentials.status,
          loginTime: new Date().toISOString(),
          isLoggedIn: true,
        };

        localStorage.setItem("currentUser", JSON.stringify(userDataToStore));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/home");
        return;
      }

      // If hardcoded credentials don't match, try database
      const response = await fetch("http://localhost:3001/users");

      if (!response.ok) throw new Error("Failed to connect to server");

      const users = await response.json();

      const user = users.find(
        (u) =>
          u.countryCode === formData.countryCode &&
          u.phoneNumber === formData.phoneNumber &&
          u.password === formData.password
      );

      if (user) {
        const userDataToStore = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          status: user.status,
          loginTime: new Date().toISOString(),
          isLoggedIn: true,
        };

        localStorage.setItem("currentUser", JSON.stringify(userDataToStore));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/home");
      } else {
        setErrors({
          general: "User not found or incorrect password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4 relative">
        <span className="relative text-[#2a586f] z-10">Login</span>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fac167] z-0"></div>
      </h1>

      <div className="w-full max-w-96 bg-white rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {/* Phone Number Section */}
          <div className="space-y-2">
            <label className="text-md font-bold text-[#313131]">Mobile Number</label>
            <div className="flex gap-2 relative">
              {/* Country Code Dropdown */}
              <div className="relative w-24">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full h-11 border border-gray-300 rounded-md flex items-center justify-between px-2 text-sm bg-white"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        countries.find((c) => c.code === formData.countryCode)?.flag
                      }
                      alt="flag"
                      className="w-5 h-5"
                    />
                    {formData.countryCode}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                    {countries.map((country) => (
                      <li
                        key={country.code}
                        className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            countryCode: country.code,
                          }));
                          setShowDropdown(false);
                        }}
                      >
                        <img
                          src={country.flag}
                          alt={country.label}
                          className="w-5 h-5"
                        />
                        {country.code}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
            {errors.phoneNumber && (
              <div className="text-sm text-red-600">{errors.phoneNumber}</div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-md font-bold text-[#313131]">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full h-11 border border-gray-300 rounded-md px-3 text-sm"
            />
            {errors.password && (
              <div className="text-sm text-red-600">{errors.password}</div>
            )}
          </div>

          {/* Submit */}
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
            <a
              href="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}