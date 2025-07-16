// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <img
        src="/image/notfound.jpg" // Place this image in public/images/
        alt="404 Not Found"
        className=" w-3/6 mb-8"
      />
      <h1 className="text-6xl text-gray-800 mb-8">Sorry, it looks like the page get lost
</h1>

      <Link
        to="/"
        className="px-6 py-2 bg-[#2A586F] transition text-white rounded-md"
      >
        Go Home
      </Link>
    </div>
  );
}
