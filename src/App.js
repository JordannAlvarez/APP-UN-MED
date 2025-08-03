import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import HistoryPage from './pages/HistoryPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pb-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
};

export default App;