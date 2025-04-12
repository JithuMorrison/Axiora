import React, { useState } from 'react';
import { filterMOU, exportToExcel } from '../../utils/excel';
import { toast } from 'react-toastify';
import { FiDownload, FiFilter, FiCalendar, FiUser, FiBook, FiClock } from 'react-icons/fi';

const MOUDownload = () => {
  const [filters, setFilters] = useState({
    academicYear: '',
    instituteName: '',
    facultyName: '',
    duration: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const filteredData = filterMOU(filters);
      if (filteredData.length === 0) {
        toast.warning('No records match your filters');
        return;
      }
      await exportToExcel(filteredData, `MOU_Data_${new Date().toISOString().split('T')[0]}`);
      toast.success('Download started successfully');
    } catch (error) {
      toast.error('Failed to generate download');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      academicYear: '',
      instituteName: '',
      facultyName: '',
      duration: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Export MOU Data</h2>
              <p className="text-gray-600">Filter and download MOU records as Excel file</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isDownloading ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isDownloading ? 'Processing...' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 h-4 w-4 text-gray-500" />
                    Academic Year
                  </div>
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleFilterChange}
                  placeholder="e.g. 2023-2024"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <FiBook className="mr-2 h-4 w-4 text-gray-500" />
                    Institute Name
                  </div>
                </label>
                <input
                  type="text"
                  name="instituteName"
                  value={filters.instituteName}
                  onChange={handleFilterChange}
                  placeholder="Search by institute"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <FiUser className="mr-2 h-4 w-4 text-gray-500" />
                    Faculty Name
                  </div>
                </label>
                <input
                  type="text"
                  name="facultyName"
                  value={filters.facultyName}
                  onChange={handleFilterChange}
                  placeholder="Search by faculty"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <FiClock className="mr-2 h-4 w-4 text-gray-500" />
                    Duration (Year)
                  </div>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  placeholder="e.g. 2023"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center ${
                  isDownloading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiDownload className="mr-2 h-5 w-5" />
                    Download Excel
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Download Tips</h3>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc pl-5">
              <li>Use filters to narrow down your export</li>
              <li>Leave fields blank to include all records</li>
              <li>File will be downloaded as Excel (.xlsx) format</li>
              <li>For large datasets, filtering first is recommended</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MOUDownload;