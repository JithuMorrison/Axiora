import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FiUser, 
  FiMail, 
  FiKey, 
  FiSave, 
  FiArrowLeft, 
  FiEdit2,
  FiLock,
  FiCheck,
  FiX
} from 'react-icons/fi';

const Profile = ({ user, setUser, theme }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put('http://localhost:5000/api/users/update-info', {
        name: formData.name,
        email: formData.email
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser(response.data.user);
      localStorage.setItem('mouser', JSON.stringify(response.data.user));
      toast.success(
        <div className="flex items-center">
          <FiCheck className="mr-2 text-green-500" />
          <span>Profile updated successfully</span>
        </div>
      );
      setIsEditing(false);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <FiX className="mr-2 text-red-500" />
          <span>{error.response?.data?.message || 'Failed to update profile'}</span>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error(
          <div className="flex items-center">
            <FiX className="mr-2 text-red-500" />
            <span>New passwords don't match</span>
          </div>
        );
        return;
      }

      await axios.put('http://localhost:5000/api/users/update-password', {
        email: user.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success(
        <div className="flex items-center">
          <FiCheck className="mr-2 text-green-500" />
          <span>Password updated successfully</span>
        </div>
      );
      setIsPasswordEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <FiX className="mr-2 text-red-500" />
          <span>{error.response?.data?.message || 'Failed to update password'}</span>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-6 group transition-colors duration-200 ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          <FiArrowLeft className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border`}>
          {/* Profile Header */}
          <div className={`p-6 md:p-8 border-b ${
            theme === 'dark' ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'
          }`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                <FiUser className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className={`mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Manage your account information and security
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Personal Information Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiUser className="mr-2" />
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } shadow-md hover:shadow-lg`}
                  >
                    <FiEdit2 className="mr-2" />
                    Edit Info
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          ...formData,
                          name: user.name,
                          email: user.email
                        });
                      }}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                      }`}
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="infoForm"
                      disabled={isLoading}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                        isLoading 
                          ? 'bg-green-500 cursor-not-allowed' 
                          : theme === 'dark' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-green-500 hover:bg-green-600'
                      } text-white shadow-md hover:shadow-lg`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <form id="infoForm" onSubmit={handleInfoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-3 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                      />
                    ) : (
                      <div className={`px-4 py-3 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user?.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block mb-3 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                      />
                    ) : (
                      <div className={`px-4 py-3 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user?.email}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Password Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiLock className="mr-2" />
                  Password & Security
                </h2>
                {!isPasswordEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsPasswordEditing(true)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } shadow-md hover:shadow-lg`}
                  >
                    <FiEdit2 className="mr-2" />
                    Change Password
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPasswordEditing(false);
                        setFormData({
                          ...formData,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                      }`}
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="passwordForm"
                      disabled={isLoading}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                        isLoading 
                          ? 'bg-green-500 cursor-not-allowed' 
                          : theme === 'dark' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-green-500 hover:bg-green-600'
                      } text-white shadow-md hover:shadow-lg`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <form id="passwordForm" onSubmit={handlePasswordSubmit}>
                {isPasswordEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={`block mb-3 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className={`block mb-3 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                        minLength="6"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className={`block mb-3 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                        minLength="6"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
              </form>

              {isPasswordEditing && (
                <div className={`mt-6 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50 border border-gray-600' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Password Requirements
                  </h4>
                  <ul className={`text-xs space-y-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li className="flex items-center">
                      <FiCheck className={`mr-2 ${
                        formData.newPassword.length >= 6 ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      At least 6 characters
                    </li>
                    <li className="flex items-center">
                      <FiCheck className={`mr-2 ${
                        formData.newPassword && formData.newPassword === formData.confirmPassword 
                          ? 'text-green-500' 
                          : 'text-gray-400'
                      }`} />
                      Passwords must match
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;