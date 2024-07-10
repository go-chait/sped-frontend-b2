import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DynamicLoginPage from './components/DynamicLoginPage';
import SignUpPage from './components/SignUpPage';
import StaticAdminPage from './components/StaticAdminPage';
import ScrapeForm from './components/ScrapeForm';
import ScrapeFileFormAdmin from './components/ScrapeFileForm_Admin'; // Import the ScrapeFileForm component
import ScrapeFileFormUser from './components/ScrapeFileForm_User';
import UserDocuments from './components/UserDocuments';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DynamicLoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<StaticAdminPage />} />
        <Route path="/login" element={<DynamicLoginPage />} />
        <Route path="/scrape" element={<ScrapeForm />} />
        <Route path="/scrape-file-admin" element={<ScrapeFileFormAdmin />} /> 
        <Route path="/scrape-file-user" element={<ScrapeFileFormUser />} />   
        <Route path="/user-documents" element={<UserDocuments />} />         
      </Routes>
    </Router>
  );
}

export default App;
