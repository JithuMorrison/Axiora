import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FiSearch, FiRefreshCw, FiCalendar, FiUser, FiBook, FiFileText, FiChevronLeft, FiChevronRight, FiDownload, FiEdit, FiX, FiSave } from 'react-icons/fi';

const MOUList = () => {
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    instituteName: '',
    startDate: '',
    endDate: '',
    signedBy: '',
    facultyDetails: '',
    academicYear: '',
    purpose: '',
    outcomes: '',
    fileName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('moudetails');
        if (storedData) {
          const transformedData = JSON.parse(storedData);
          setSheetData(transformedData);
        } else {
          console.error('No MOU data found in localStorage');
        }
      setLoading(false);
    } catch (error) {
      toast.error('Error loading MOU data');
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEditClick = (mou) => {
    setEditingId(mou.rowIndex);
    setEditFormData({
      instituteName: mou.instituteName,
      startDate: mou.startDate,
      endDate: mou.endDate,
      signedBy: mou.signedBy,
      facultyDetails: mou.facultyDetails,
      academicYear: mou.academicYear,
      purpose: mou.purpose,
      outcomes: mou.outcomes,
      fileName: mou.fileName
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveClick = async () => {
    try {
      await axios.post('http://localhost:5000/update-mou', {
        rowIndex: editingId-1,
        updatedData: editFormData
      });
      toast.success('MOU updated successfully');
      setEditingId(null);
      fetchData(); // Refresh the data
    } catch (error) {
      toast.error('Error updating MOU');
      console.error('Error updating MOU:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...sheetData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [sheetData, sortConfig]);

  const filteredData = sortedData.filter(mou =>
    Object.values(mou).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/get-pdf/${fileName}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('❌ Download failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">MOU Records</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search MOUs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {sheetData.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No MOU records found</h3>
              <p className="mt-1 text-sm text-gray-500">Add a new MOU to get started</p>
              <button
                onClick={fetchData}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('instituteName')}
                      >
                        <div className="flex items-center">
                          <FiBook className="mr-2 h-4 w-4" />
                          Institute Name
                          {sortConfig.key === 'instituteName' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('startDate')}
                      >
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 h-4 w-4" />
                          Duration
                          {sortConfig.key === 'startDate' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('signedBy')}
                      >
                        <div className="flex items-center">
                          <FiUser className="mr-2 h-4 w-4" />
                          Signed By
                          {sortConfig.key === 'signedBy' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Agreement
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((mou) => (
                      <tr key={mou.rowIndex} className="hover:bg-gray-50 transition-colors">
                        {/* Institute Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === mou.rowIndex ? (
                            <input
                              type="text"
                              name="instituteName"
                              value={editFormData.instituteName}
                              onChange={handleEditFormChange}
                              className="w-full border border-gray-300 rounded-md px-2 py-1"
                            />
                          ) : (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                {mou.instituteName.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{mou.instituteName}</div>
                                <div className="text-sm text-gray-500">{mou.academicYear}</div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === mou.rowIndex ? (
                            <div className="space-y-2">
                              <input
                                type="date"
                                name="startDate"
                                value={editFormData.startDate}
                                onChange={handleEditFormChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                              />
                              <input
                                type="date"
                                name="endDate"
                                value={editFormData.endDate}
                                onChange={handleEditFormChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-gray-900">
                                {mou.startDate && format(new Date(mou.startDate), 'MMM dd, yyyy')} -{' '}
                                {mou.endDate && format(new Date(mou.endDate), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {mou.startDate && mou.endDate && (
                                  <>
                                    {Math.ceil(
                                      (new Date(mou.endDate) - new Date(mou.startDate)) /
                                        (1000 * 60 * 60 * 24)
                                    )}{' '}
                                    days
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </td>

                        {/* Signed By */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === mou.rowIndex ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                name="signedBy"
                                value={editFormData.signedBy}
                                onChange={handleEditFormChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                placeholder="Signed By"
                              />
                              <input
                                type="text"
                                name="facultyDetails"
                                value={editFormData.facultyDetails}
                                onChange={handleEditFormChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                placeholder="Faculty Details"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-gray-900">{mou.signedBy}</div>
                              <div className="text-sm text-gray-500">{mou.facultyDetails}</div>
                            </>
                          )}
                        </td>

                        {/* Agreement */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {mou.agreementFileId ? (
                            <button
                              onClick={() => downloadFile(mou.agreementFileId, mou.fileName)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FiDownload className="mr-1" />
                              Download
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">No file</span>
                          )}
                        </td>

                        {/* Created By */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mou.createdBy}</div>
                          <div className="text-sm text-gray-500">
                            {mou.createdAt && format(new Date(mou.createdAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingId === mou.rowIndex ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveClick}
                                className="text-green-600 hover:text-green-900"
                                title="Save"
                              >
                                <FiSave className="h-5 w-5" />
                              </button>
                              <button
                                onClick={handleCancelClick}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel"
                              >
                                <FiX className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(mou)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredData.length > itemsPerPage && (
                <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
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
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MOUList;