import React, { useState, useEffect } from 'react';
import { addMOU } from '../../utils/excel';
import { showNewMOUNotification } from '../../utils/notification';
import { toast } from 'react-toastify';
import { FiUpload, FiCalendar, FiUser, FiBook, FiTarget, FiFileText } from 'react-icons/fi';

const MOUForm = ({ user }) => {
  const [formData, setFormData] = useState({
    instituteName: '',
    startDate: '',
    endDate: '',
    signedBy: user?.name || '',
    facultyDetails: '',
    academicYear: '',
    purpose: '',
    outcomes: '',
    agreementFile: null,
    createdBy: user?.email || '',
    createdAt: new Date().toISOString()
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      checkMOURenewals();
    }, 86400000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'agreementFile' && files && files[0]) {
      setFilePreview(files[0].name);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.instituteName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      await addMOU(formData);
      showNewMOUNotification(formData.instituteName);
      toast.success('MOU added successfully!');
      
      setFormData({
        instituteName: '',
        startDate: '',
        endDate: '',
        signedBy: user?.name || '',
        facultyDetails: '',
        academicYear: '',
        purpose: '',
        outcomes: '',
        agreementFile: null,
        createdBy: user?.email || '',
        createdAt: new Date().toISOString()
      });
      setFilePreview(null);
    } catch (error) {
      toast.error('Failed to add MOU. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6">
  Add New MOU Agreement
</h2>
        <p className="text-gray-600">Fill out the form below to register a new Memorandum of Understanding</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institute Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Industry/Institute Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiBook className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter institute name"
              required
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Signed By */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Signed By (Faculty Name)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="signedBy"
              value={formData.signedBy}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter faculty name"
              required
            />
          </div>
        </div>

        {/* Faculty Details */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Faculty Details
          </label>
          <textarea
            name="facultyDetails"
            value={formData.facultyDetails}
            onChange={handleChange}
            rows={3}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional details about the faculty"
          />
        </div>

        {/* Academic Year */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 2023-2024"
          />
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Purpose of MOU
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={3}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the purpose of this MOU"
          />
        </div>

        {/* Expected Outcomes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Expected Outcomes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <FiTarget className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              rows={3}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List the expected outcomes from this collaboration"
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Signed Agreement Document
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="agreementFile"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <div className="flex flex-col items-center">
                    <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2">Upload a file</span>
                    {filePreview && (
                      <span className="mt-1 text-xs text-gray-500">{filePreview}</span>
                    )}
                  </div>
                  <input
                    id="agreementFile"
                    name="agreementFile"
                    type="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit MOU Agreement'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MOUForm;