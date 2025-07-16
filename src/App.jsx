import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Landing from '../components/Landing';
import LoginForm from '../components/Login';
import Signin from '../components/Signin';
import Home from '../components/Home';
import QuizApp from '../components/Home';
import Result from '../components/Result';


const App = () => {
  const location = useLocation();
  const routesWithNavbar = ['/', '/login', '/signin',];
  const showNavbar = routesWithNavbar.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<QuizApp />} />
        <Route path='/result' element={<Result/>}/>
      </Routes>
    </div>
  );
};

export default App;