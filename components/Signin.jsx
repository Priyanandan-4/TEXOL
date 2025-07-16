import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  countryCode: Yup.string().required("Country code is required"),
  status: Yup.string()
    .oneOf(["student", "employee"], "Invalid status")
    .required("Status is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signin() {
  const navigate = useNavigate();

  const initialValues = {
    fullName: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    status: "employee",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      resetForm();
      navigate("/login");
    } catch (error) {
      console.error("Error submitting form:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      <h1 className="text-3xl font-extrabold text-gray-900 relative inline-block mb-4 ">
       <span className="relative text-[#313131] z-10">Register</span> 
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fac167] z-0"></div>
      </h1>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-gray-900 mb-1">
                  Full Name
                </label>
                <Field
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-900 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-900 mb-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Field
                      as="select"
                      name="countryCode"
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+86">🇨🇳 +86</option>
                    </Field>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                  <Field
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                  />
                </div>
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
                <ErrorMessage
                  name="countryCode"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>

              {/* Current Status */}
              <div>
                <label className="block text-xs font-medium text-gray-900 mb-2">Current Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <Field
                      type="radio"
                      name="status"
                      value="student"
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-1 text-xs text-gray-900">Student</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <Field
                      type="radio"
                      name="status"
                      value="employee"
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-1 text-xs text-gray-900">Employee</span>
                  </label>
                </div>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-900 mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Save"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}