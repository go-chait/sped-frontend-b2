import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DynamicLoginPage from './components/DynamicLoginPage';
import SignUpPage from './components/SignUpPage';
import StaticAdminPage from './components/StaticAdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DynamicLoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<StaticAdminPage />} />
        <Route path="/login" element={<DynamicLoginPage />} />      
      </Routes>
    </Router>
  );
}

export default App;
