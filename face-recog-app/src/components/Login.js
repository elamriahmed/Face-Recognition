import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8001/login',
        { username, password },
        { withCredentials: true }
      );

      if (response.data && response.data.role) {
        onLogin(response.data.role);
        navigate('/'); 
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate__animated animate__fadeIn animate__faster">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Please log in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="peer block w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out"
              disabled={loading}
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
              placeholder="Password"
              className="peer block w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out"
              disabled={loading}
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
              Password
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-500">
          <p>
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
