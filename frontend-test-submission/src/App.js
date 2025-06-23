import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/analytics" element={<StatisticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
