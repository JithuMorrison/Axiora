import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSettings, FiRefreshCw, FiSave, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const SettingsPage = ({ theme }) => {
  const [settings, setSettings] = useState({
    autoRenew: false,
    renewalThreshold: 1, // months
    notificationDays: 7, // days before expiration
    emailNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        setSettings(response.data);
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className={`rounded-xl shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className="text-2xl font-bold flex items-center">
            <FiSettings className="mr-2" />
            System Settings
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure application preferences and automation
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Auto-Renew Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiRefreshCw className="mr-2" />
                Auto-Renewal Settings
              </h2>
              
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} mb-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Enable Auto-Renewal</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Automatically renew expiring MOUs
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, autoRenew: !prev.autoRenew }))}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      settings.autoRenew 
                        ? 'bg-blue-600' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform transition-transform rounded-full bg-white ${
                      settings.autoRenew ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {settings.autoRenew && (
                  <>
                    <div className="mb-4">
                      <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Renewal Threshold (months before expiration)
                      </label>
                      <select
                        name="renewalThreshold"
                        value={settings.renewalThreshold}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} month{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Notification Days Before Expiration
                      </label>
                      <input
                        type="number"
                        name="notificationDays"
                        min="1"
                        max="30"
                        value={settings.notificationDays}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive email alerts for expiring MOUs
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      settings.emailNotifications 
                        ? 'bg-blue-600' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 transform transition-transform rounded-full bg-white ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg flex items-center ${
                  saving 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white shadow-md hover:shadow-lg transition-all duration-200`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;