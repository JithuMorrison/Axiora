import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from Google Sheets on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/sheet-data');
        // Transform the array of arrays into array of objects
        const userData = response.data.values.map(row => ({
          name: row[0] || '',
          email: row[1] || '',
          password: row[2] || '',
          createdAt: row[3] || ''
        }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load user data');
      }
    };
    
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        toast.error('User not found');
        return;
      }
      
      // Check password (Note: In production, use proper password hashing)
      if (user.password !== password) {
        toast.error('Invalid password');
        return;
      }
      
      // Authentication successful
      const userInfo = {
        name: user.name,
        email: user.email,
        // Don't store password in local storage
        createdAt: user.createdAt
      };
      
      // Store user info in localStorage
      localStorage.setItem('mouser', JSON.stringify(userInfo));
      
      // Update app state
      setUser(userInfo);
      
      // Navigate to dashboard
      navigate('/dashboard');
      toast.success('Login successful!');
      
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleback = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4 -mx-35 -my-3">
      <button
        className="absolute top-20 right-10 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
        onClick={handleback}
      >
        <FaArrowLeft className="text-white" />
        Back
      </button>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-200">
        <h2 className="text-3xl font-bold text-center mb-6">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </span> 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;