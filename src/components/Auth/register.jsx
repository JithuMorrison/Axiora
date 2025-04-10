import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/auth';
import { toast } from 'react-toastify';
import { FaUserPlus,FaArrowLeft } from 'react-icons/fa';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setUser({ email: formData.email, name: formData.name });
      navigate('/dashboard');
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleback = () => {
    navigate('/');
  } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10 -mx-35 -my-3">
      <button
        className="absolute top-20 right-10 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
        onClick={handleback}
      >
        <FaArrowLeft className="text-white" />
        Back
      </button>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-gray-800">
        <div className="text-center mb-6">
          <FaUserPlus className="text-4xl text-indigo-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-sm text-gray-500">Join MOUTracker today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              placeholder="example@mail.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
