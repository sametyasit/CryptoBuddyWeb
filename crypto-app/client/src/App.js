import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import GlobalStyle from './styles/GlobalStyle';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import News from './pages/News';
import About from './pages/About';
import AIBasket from './pages/AIBasket';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CoinDetail from './pages/CoinDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
import Education from './pages/Education';
import PrivateRoute from './components/PrivateRoute';
import Convert from './pages/transactions/Convert';
import Swap from './pages/transactions/Swap';
import Launchpool from './pages/transactions/Launchpool';
import Earn from './pages/Earn';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import IntroAnimation from './components/IntroAnimation';
import { AnimatePresence } from 'framer-motion';
import LuxuryExamplePage from './components/LuxuryExamplePage';

// AnimatePresence için özel bir Routes bileşeni oluşturuyoruz
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/news" 
          element={<News />} 
        />
        <Route 
          path="/about" 
          element={<About />} 
        />
        <Route 
          path="/ai-basket" 
          element={<AIBasket />} 
        />
        <Route 
          path="/education" 
          element={<Education />} 
        />
        <Route 
          path="/profile" 
          element={<Profile />} 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        <Route 
          path="/reset-password/:token" 
          element={<ResetPassword />} 
        />
        <Route 
          path="/coin/:id" 
          element={<CoinDetail />} 
        />
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route
          path="/portfolio"
          element={
            <PrivateRoute>
              <Portfolio />
            </PrivateRoute>
          }
        />
        {/* İşlemler Sayfaları */}
        <Route 
          path="/transactions/convert" 
          element={<Convert />} 
        />
        <Route 
          path="/transactions/swap" 
          element={<Swap />} 
        />
        <Route 
          path="/transactions/launchpool" 
          element={<Launchpool />} 
        />
        <Route 
          path="/transactions/earn" 
          element={<Earn />} 
        />
        <Route path="/luxury-demo" element={<LuxuryExamplePage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <GlobalStyle />
          {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
          {!showIntro && (
            <>
              <Navbar />
              <AnimatedRoutes />
            </>
          )}
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App; 