import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send signup request to the backend
      const response = await axios.post(
        'http://localhost:8001/signup',
        { username, password, role }
      );
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data.message || 'Signup failed');
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate__animated animate__fadeIn animate__faster">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Join us and start your journey</p>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && <p className="text-center text-red-500">{error}</p>}
          {message && <p className="text-center text-green-500">{message}</p>}

          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer block w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
              Username
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer block w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
              Password
            </label>
          </div>

          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`peer block w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out`}
              required
            >
              <option value="" disabled hidden>Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label
              className={`absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200
              ${!role ? 'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base' : 'peer-focus:top-2 peer-focus:text-sm'}`}
            >
              Role
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
