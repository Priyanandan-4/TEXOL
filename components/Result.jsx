import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home } from "lucide-react";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const score = searchParams.get("score");
  const totalQuestions = searchParams.get("totalQuestions");

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleBackToHome = () => navigate("/home");

  const getFirstLetter = () =>
    currentUser?.fullName?.charAt(0).toUpperCase() || "U";

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <img src="./image/logoone.png" alt="Logo" className="w-52" />
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-16 h-16 rounded-full overflow-hidden"
          >
            <img
              src="./image/men.png"
              alt="profile"
              className="w-full h-full object-cover bg-[#CDCCCC]"
            />
          </button>
          {showLogout && (
            <div className="absolute right-0 mt-2 w-56 bg-white border shadow rounded z-20">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">{currentUser.fullName}</p>
                <p className="text-xs text-gray-500">
                  {currentUser.countryCode} {currentUser.phoneNumber}
                </p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-500 flex items-center gap-2 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-between px-4 pb-4">
        {/* Top Success Message */}
        <div className=" text-center flex flex-col justify-center items-center gap-2">
  <img
  src="./image/tick.png"  
  alt="Success"
  className="w-16 h-16 mx-auto mb-2"
/>

          <h2 className="text-lg font-semibold mb-1">
            Congratulations you have Successfully Completed The Test
          </h2>
          <p className="mb-1">
            <span className="font-medium">Score :</span>{" "}
            <span className="bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full">
              {score}/{totalQuestions}
            </span>
          </p>
          <p className="bg-[#2F5D73] text-white px-4 py-1  w-52 rounded-md font-semibold">
            Your ID : {currentUser?.id || "784962"}
          </p>
        </div>

        {/* Feedback Box */}
        <div className="bg-white w-full max-w-2xl  shadow-xl rounded-md p-5">
          <h3 className="text-lg font-bold mb-2">Feedback</h3>
          <p className="text-sm mb-1 font-medium">Give us a feedback!</p>
          <p className="text-sm text-gray-500 mb-3">
            Your input is important for us. We take customer feedback seriously.
          </p>
         <div className="flex mb-3  text-3xl ">
  {["😟", "😞", "😐", "🙂", "😄"].map((emoji, i) => (
    <button
      key={i}
      className="  hover:text-yellow-400 hover:scale-110 transition-all"
    >
      {emoji}
    </button>
  ))}
</div>

          <textarea
            rows="3"
            placeholder="Add a comment"
            className="w-full text-sm border border-[#DFDFDF] rounded p-3 mb-3"
          ></textarea>
          <button
            onClick={() => alert("Successfully sent")}
            className="w-56 bg-[#2F5D73] text-white py-2 rounded hover:bg-[#234859] transition"
          >
            Submit Feedback
          </button>
        </div>

        {/* Back to home */}
        <button
          onClick={handleBackToHome}
          className="mt-4 text-sm text-black flex items-center gap-1 hover:underline"
        >
          <Home className="w-4 h-4" />
          Back to home
        </button>
      </div>
    </div>
  );
}
