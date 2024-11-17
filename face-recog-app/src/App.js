import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UploadImage from './components/UploadImage';
import KnownFaces from './components/KnownFaces';
import InsertData from './components/InsertData';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Statistics from './components/Statistics';

const App = () => {
  // Initialize state using values from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || ''); // Check localStorage for the role

  // Handle login by setting authentication state and storing the token and role
  const handleLogin = (role) => {
    const token = "your_token"; // Replace this with the token from your login response
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role); // Store the role in localStorage
    setIsAuthenticated(true);
    setUserRole(role); // Set user role in state
  };

  // Handle logout by clearing authentication state and removing the token and role from localStorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(''); // Clear user role in state
  };

  // Protected route component
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<UploadImage />} />} />
          <Route path="/known-faces" element={<ProtectedRoute element={<KnownFaces isAuthenticated={isAuthenticated} userRole={userRole} />} />} />
          <Route path="/insert" element={<ProtectedRoute element={<InsertData />} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/statistics" element={<ProtectedRoute element={<Statistics />} />} /> {/* Add the Statistics route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
