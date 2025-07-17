import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bookmark, LogOut, Clock, Table2 } from "lucide-react";
import { questions } from "/src/data/questionsData";

export default function QuizApp() {
  const router = useNavigate();

  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [bookmarked, setBookmarked] = useState(false);
  const [questionStatuses, setQuestionStatuses] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router("/login");
      }
    } else {
      router("/login");
    }
  }, [router]);

  useEffect(() => {
    setQuestionsData(questions);
    setQuestionStatuses(
      questions.map((q, i) => ({
        id: q.id,
        status: i === 0 ? "current" : "upcoming",
      }))
    );
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getFirstLetter = () => {
    return currentUser?.fullName?.charAt(0).toUpperCase() || "U";
  };

  const calculateProgressPercentage = () => {
    return ((currentQuestion + 1) / questionsData.length) * 100;
  };

  const getQuestionButtonStyle = (index) => {
    const isActive = index === currentQuestion;
    const hasAnswer = userAnswers.hasOwnProperty(index);
    const isVisited = visitedQuestions.has(index);

    if (isActive) return " text-black border-[#2A586F]";
    if (hasAnswer) return "bg-[#E7FFD9] text-black border-[#2A586F]";
    if (isVisited) return "bg-gray-400 text-black border-[#2A586F]";
    return "bg-white text-gray-700 border-gray-300";
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: index,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questionsData.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      setSelectedAnswer(userAnswers[next] ?? null);
      setBookmarked(false);
      setVisitedQuestions((prev) => new Set([...prev, next]));
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prev = currentQuestion - 1;
      setCurrentQuestion(prev);
      setSelectedAnswer(userAnswers[prev] ?? null);
      setBookmarked(false);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestion(index);
    setSelectedAnswer(userAnswers[index] ?? null);
    setBookmarked(false);
    setVisitedQuestions((prev) => new Set([...prev, index]));
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questionsData.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) correctAnswers++;
    });
    router(`/result?score=${correctAnswers}&totalQuestions=${questionsData.length}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    router("/login");
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setSelectedAnswer(null);
    setTimeLeft(300);
    setVisitedQuestions(new Set([0]));
    setQuestionStatuses(
      questionsData.map((q, i) => ({
        id: q.id,
        status: i === 0 ? "current" : "upcoming",
      }))
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questionsData[currentQuestion];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`hidden md:block w-72 border-r border-gray-200 flex-col overflow-y-auto ${sidebarCollapsed ? 'border-white ' : ''}`}>
        <img src="./image/logoone.png" alt="Logo" className="w-96 px-4" />
        <div className={`text-gray-700 rounded-lg transition-colors ${sidebarCollapsed ? 'pl-8 mt-6 ' : 'ml-60'}`}>
          <Table2 onClick={toggleSidebar} />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col justify-between h-96 p-6">
            <div className="grid grid-cols-4 gap-3 mb-8">
              {questionsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestionNavigation(i)}
                  className={`w-14 h-12 rounded-sm font-medium text-sm transition-colors border-2 ${getQuestionButtonStyle(i)}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="space-y-4 text-sm px-3 py-3 shadow-2xl rounded-sm mt-44">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-gray-700 font-medium">Visited</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                <span className="text-gray-700 font-medium">Upcoming</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ">
        <header className="px-8 py-6 flex items-center justify-between md:justify-end">
          <div className="md:hidden">
            <img src="./image/logoone.png" alt="Logo" className="w-52" />
          </div>
          <div className="relative">
            <div
              onClick={() => setShowLogout(!showLogout)}
              className=" w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-colors"
              title={`${currentUser.fullName} - ${currentUser.phoneNumber}`}
            >
                 <img
              src="./image/men.png"
              alt="profile"
              className="w-full h-full  rounded-full object-cover bg-[#CDCCCC]"
            />
            </div>
            {showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.fullName}</p>
                  <p className="text-xs text-gray-500">{currentUser.countryCode} {currentUser.phoneNumber}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:text-red-600 font-medium hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-2">
          <div className={`max-w-6xl mx-auto ${sidebarCollapsed ? 'ml-5' : ''}  `}>
            <div className="text-center ">
         
 <h1 className="text-3xl font-extrabold text-gray-800 relative z-30">
  Assess Your{" "}
  <span className="relative inline-block z-10 text-[#2a586f]">
    Intelligence
    <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#fac167] -z-10 rounded-sm"></span>
  </span>
</h1>

            </div>

            <div className="flex items-center justify-between mb-4 mt-12 md:mt-0">
              <div className="flex-1 max-w-3xl">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-6">
                <span className="text-base font-semibold text-gray-700">
                  {currentQuestion + 1}/{questionsData.length}
                </span>
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-medium flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {currentQuestionData && (
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm p-6  ">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-base">
                    {currentQuestion + 1}
                  </div>
                  <h2 className="text-lg font-medium text-gray-800 leading-relaxed">
                    {currentQuestionData.question}
                  </h2>
                </div>

                <div className="space-y-3 mb-6 bg-white p-4 rounded-[10px]">
                  {currentQuestionData.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-2 w-60 bg-[#FAFAFA] rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedAnswer === index ? "border-green-400 bg-green-50" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => handleAnswerSelect(index)}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                          selectedAnswer === index ? "border-green-500" : "border-[#929292]"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            selectedAnswer === index ? "bg-green-500" : "bg-[#929292]"
                          }`}
                        />
                      </div>
                      <span className="ml-3 text-gray-700 font-medium text-base">{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-lg ${
                      bookmarked ? "text-orange-600 bg-orange-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                        currentQuestion > 0
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>
                    {currentQuestion < questionsData.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm bg-teal-600 text-white hover:bg-teal-700"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm bg-green-600 text-white hover:bg-green-700"
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}