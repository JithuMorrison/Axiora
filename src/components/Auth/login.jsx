import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../utils/auth';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = authenticateUser(email, password);
    if (user) {
      setUser(user);
      navigate('/dashboard');
      toast.success('Login successful!');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const handleback = () => {
    navigate('/');
  } 

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
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
