import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiActivity, FiRefreshCw, FiCalendar, FiUser, FiFileText, FiDownload } from 'react-icons/fi';

const ActivityLogPage = ({ theme }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchActivities();
  }, [currentPage]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/activity?page=${currentPage}&limit=${itemsPerPage}`);
      setActivities(response.data);
    } catch (error) {
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (mouId) => {
    try {
      await axios.post('http://localhost:5000/api/mou/renew', { id: mouId });
      toast.success('MOU renewed for 1 month');
      fetchActivities();
    } catch (error) {
      toast.error('Failed to renew MOU');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return <FiFileText className="text-green-500" />;
      case 'update':
        return <FiRefreshCw className="text-blue-500" />;
      case 'download':
        return <FiDownload className="text-purple-500" />;
      case 'renew':
        return <FiCalendar className="text-yellow-500" />;
      default:
        return <FiActivity className="text-gray-500" />;
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className={`rounded-xl shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className="text-2xl font-bold flex items-center">
            <FiActivity className="mr-2" />
            Activity Log
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            System activities and user actions
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <FiActivity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No activities found</h3>
              <p className="mt-1 text-sm text-gray-500">System activities will appear here</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {activities.map((activity) => (
                      <tr key={activity._id} className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {activity.action}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {activity.details}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {activity.user}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {activity.type === 'expiring' && (
                            <button
                              onClick={() => handleRenew(activity.mouId)}
                              className={`px-3 py-1 rounded-md ${
                                theme === 'dark' 
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                  : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                              }`}
                            >
                              Renew (+1 month)
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                >
                  Previous
                </button>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={activities.length < itemsPerPage}
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} ${activities.length < itemsPerPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;