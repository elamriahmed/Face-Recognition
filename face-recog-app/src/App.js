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
  // Check if a token exists in localStorage to set initial authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  //const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));

  const [userRole, setUserRole] = useState(''); // State to hold user role

  // Handle login by setting authentication state and storing the token and role
  const handleLogin = (role) => {
    const token = "your_token"; // You need to get the token from your login response
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUserRole(role); // Set user role on login
  };

  // Handle logout by clearing authentication state and removing the token
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(''); // Clear user role on logout
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
          <Route path="/known-faces" element={<ProtectedRoute element={<KnownFaces />} />} />
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
