import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaImage, FaPlus, FaBars, FaUserCircle, FaChartBar } from 'react-icons/fa'; 

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("Navbar isAuthenticated:", isAuthenticated);
    console.log("User Role:", userRole); 
  }, [isAuthenticated, userRole]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50 w-full">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo */}
        <div className="text-white text-3xl font-bold hover:opacity-80 transition-opacity duration-300">
          <Link to="/">FaceApp</Link>
        </div>

        {/* Hamburger Menu for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu" className="text-white focus:outline-none">
            <FaBars size={28} />
          </button>
        </div>

        {/* Main Navbar Links */}
        <nav className={`${isOpen ? 'block' : 'hidden'} md:flex space-x-8 text-center items-center transition-all duration-500 ease-in-out w-full md:w-auto`}>
          {isAuthenticated && (
            <>
              <Link to="/" className="nav-link py-2 px-4 rounded-md text-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center">
                <FaHome className="inline-block mr-2" />
                Upload Image
              </Link>
              <Link to="/known-faces" className="nav-link py-2 px-4 rounded-md text-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center">
                <FaImage className="inline-block mr-2" />
                Known Faces
              </Link>
              <Link to="/insert" className="nav-link py-2 px-4 rounded-md text-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center">
                <FaPlus className="inline-block mr-2" />
                Insert New Image
              </Link>

              {/* Conditionally render the Statistics link for admin role */}
              {userRole === 'admin' && (
                <Link to="/statistics" className="nav-link py-2 px-4 rounded-md text-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center">
                  <FaChartBar className="inline-block mr-2" />
                  Statistics
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Profile Dropdown or Login Option */}
        <div className="relative hidden md:block">
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="nav-link py-2 px-4 rounded-md text-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center">
                <FaUserCircle className="inline-block mr-2" />
                Profile
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors duration-300">My Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors duration-300">Settings</Link>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors duration-300">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link py-2 px-4 rounded-md text-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-300">
              Login
            </Link>
          )}
        </div>

        {/* Close the menu when clicking outside */}
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />
        )}
      </div>
    </header>
  );
};

export default Navbar;
