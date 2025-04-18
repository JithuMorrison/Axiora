import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiDownload, FiFilter, FiCalendar, FiUser, FiBook, FiClock, FiX, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const MOUDownload = () => {
  const [filters, setFilters] = useState({
    academicYear: '',
    instituteName: '',
    facultyName: '',
    duration: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [allMOU, setAllMOU] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('moudetails');
        if (storedData) {
          const transformedData = JSON.parse(storedData);
          setAllMOU(transformedData);
        } else {
          console.error('No MOU data found in localStorage');
        }
      } catch (error) {
        toast.error('Failed to load MOU data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filterMOU = () => {
    return allMOU.filter(mou => {
      return (
        (filters.academicYear === '' || 
         mou.academicYear.toLowerCase().includes(filters.academicYear.toLowerCase())) &&
        (filters.instituteName === '' || 
         mou.instituteName.toLowerCase().includes(filters.instituteName.toLowerCase())) &&
        (filters.facultyName === '' || 
         mou.signedBy.toLowerCase().includes(filters.facultyName.toLowerCase())) &&
        (filters.duration === '' || 
         mou.startDate.includes(filters.duration) || 
         mou.endDate.includes(filters.duration))
      );
    });
  };

  const filteredData = filterMOU();
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToExcel = (data, fileName) => {
    const excelData = data.map(mou => ({
      'Institute Name': mou.instituteName,
      'Start Date': mou.startDate,
      'End Date': mou.endDate,
      'Signed By': mou.signedBy,
      'Faculty Details': mou.facultyDetails,
      'Academic Year': mou.academicYear,
      'Purpose': mou.purpose,
      'Outcomes': mou.outcomes,
      'Created By': mou.createdBy,
      'Created At': mou.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MOU Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (filteredData.length === 0) {
        toast.warning('No records match your filters');
        return;
      }
      await exportToExcel(filteredData, `MOU_Data_${new Date().toISOString().split('T')[0]}`);
      toast.success(
        <div className="flex items-center">
          <FiCheck className="mr-2 text-green-500" />
          <span>Download started successfully</span>
        </div>
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <FiX className="mr-2 text-red-500" />
          <span>Failed to generate download</span>
        </div>
      );
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
    toast.info('Filters reset');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-2xl overflow-hidden border border-violet-100">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Export MOU Data</h2>
              <p className="text-violet-100 mt-1">Filter and download MOU records with precision</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isDownloading 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}>
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </>
                ) : (
                  `Loaded ${allMOU.length} records`
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Filter Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: <FiCalendar className="h-5 w-5 text-violet-600" />,
                name: 'academicYear',
                label: 'Academic Year',
                placeholder: 'e.g. 2023-2024',
                value: filters.academicYear
              },
              {
                icon: <FiBook className="h-5 w-5 text-violet-600" />,
                name: 'instituteName',
                label: 'Institute Name',
                placeholder: 'Search by institute',
                value: filters.instituteName
              },
              {
                icon: <FiUser className="h-5 w-5 text-violet-600" />,
                name: 'facultyName',
                label: 'Faculty Name',
                placeholder: 'Search by faculty',
                value: filters.facultyName
              },
              {
                icon: <FiClock className="h-5 w-5 text-violet-600" />,
                name: 'duration',
                label: 'Duration (Year)',
                placeholder: 'e.g. 2023',
                value: filters.duration
              }
            ].map((field) => (
              <div 
                key={field.name}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    {field.icon}
                    <span className="ml-2">{field.label}</span>
                  </div>
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleFilterChange}
                  placeholder={field.placeholder}
                  className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              onClick={handleResetFilters}
              className="px-5 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 flex items-center justify-center"
            >
              <FiX className="mr-2" />
              Reset Filters
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || loading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`px-5 py-3 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-700 transition-all duration-300 flex items-center justify-center ${
                isDownloading || loading
                  ? 'bg-violet-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 shadow-lg hover:shadow-violet-300/50'
              }`}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparing File...
                </>
              ) : (
                <>
                  <FiDownload className={`mr-2 transition-transform duration-300 ${
                    isHovered ? 'transform translate-y-[-2px]' : ''
                  }`} />
                  <span className="relative">
                    Download Excel
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-white/50 transition-all duration-300 ${
                      isHovered ? 'scale-x-100' : 'scale-x-0'
                    }`}></span>
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Data Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filtered Results: {filteredData.length} records found
            </h3>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institute
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Signed By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Year
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((mou, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{mou.instituteName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {mou.startDate} to {mou.endDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mou.signedBy}</div>
                          <div className="text-sm text-gray-500">{mou.facultyDetails}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{mou.academicYear}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No records found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredData.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredData.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number
                              ? 'z-10 bg-violet-50 border-violet-500 text-violet-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-violet-100 text-violet-600 mr-3">
                <FiFilter className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Pro Tips for Exporting</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                "Combine filters for precise data extraction",
                "Use partial names for broader searches",
                "Export regularly for data backup",
                "For large datasets, apply filters first"
              ].map((tip, index) => (
                <div 
                  key={index} 
                  className="flex items-start p-3 bg-violet-50/50 rounded-lg border border-violet-100 hover:bg-violet-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MOUDownload;