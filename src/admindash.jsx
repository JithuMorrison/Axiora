import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { parseISO, format, differenceInMonths } from 'date-fns';
import { 
  FiPlus, 
  FiFileText, 
  FiDownload, 
  FiUsers, 
  FiSettings,
  FiAlertTriangle,
  FiCalendar,
  FiChevronRight,
  FiBarChart2,
  FiDatabase
} from 'react-icons/fi';

const AdminDashboard = ({ children, theme }) => {
  const [stats, setStats] = useState({
    totalMOU: 0,
    activeMOU: 0,
    expiringSoon: 0,
    users: 0
  });
  const [expiringMOU, setExpiringMOU] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    mou: true,
    activity: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const mouDetailsRaw = localStorage.getItem('moudetails');
        const mouUsersRaw = localStorage.getItem('mousers');

        if (mouDetailsRaw && mouUsersRaw) {
        const mouDetails = JSON.parse(mouDetailsRaw);
        const mouUsers = JSON.parse(mouUsersRaw);

        const currentDate = new Date();

        // Process MOU data from moudetails
        const allMOU = mouDetails.map((row,index) => ({
            instituteName: row.instituteName || '',
            startDate: row.startDate || '',
            endDate: row.endDate || '',
            signedBy: row.signedBy || '',
            status: differenceInMonths(row.endDate, currentDate) <= 0 ? 'active' : 'deactive',
            ind : index
        }));

        const expiring = allMOU.filter(mou => {
            if (!mou.endDate) return false;
            const endDate = parseISO(mou.endDate);
            return differenceInMonths(endDate, currentDate) <= 1;
        });

        // Get users count from mouser
        const users = mouUsers.length;

        // Get recent activity - last 5 rows from moudetails (activity columns assumed at index 5 onwards)
        const recentActivity = mouDetails.slice(-5).map(mou => ({
            instituteName: mou.instituteName,
            signedBy: mou.signedBy,
            endDate: mou.endDate,
            timestamp: mou.createdAt,
          }));          

        // Set all states
        setStats({
            totalMOU: allMOU.length,
            activeMOU: allMOU.filter(m => m.status === 'active').length,
            expiringSoon: expiring.length,
            users
        });

        setExpiringMOU(expiring);
        setRecentActivity(recentActivity);
        } else {
            console.error("Local storage data not found.");
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading({
          stats: false,
          mou: false,
          activity: false
        });
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleRenewMOU = async (mouId) => {
    try {
      await axios.post('http://localhost:5000/api/mou/renew', { id: mouId });
      toast.success("MOU renewal process started");
  
      // Get localStorage data using 'moudetails'
      const storedData = JSON.parse(localStorage.getItem('moudetails')) || [];
  
      // Update matching MOU
      const updatedData = storedData.map((mou,index) =>
        index === mouId-1
          ? {
              ...mou,
              endDate: getExtendedEndDate(mou.endDate),
            }
          : mou
      );
      alert(mouId);
      console.log(storedData);
      console.log(updatedData);
  
      // Save updated data back to localStorage
      localStorage.setItem('moudetails', JSON.stringify(updatedData));
      setExpiringMOU(
        updatedData
          .map((mou, index) => ({ ...mou, index }))
          .filter(mou => {
            if (!mou.endDate) return false;
            const endDate = parseISO(mou.endDate);
            return differenceInMonths(endDate, new Date()) <= 1;
          })
      );
  
    } catch (error) {
      toast.error("Failed to initiate renewal"+error);
    }
  };
  
  // Helper function to extend endDate by 1 year
  const getExtendedEndDate = (dateStr) => {
    const date = parseISO(dateStr);
    const newDate = new Date(date.setMonth(date.getMonth() + 1));
    return newDate.toISOString(); // YYYY-MM-DD format
  };  

  return (
    <div className="space-y-8">
      {children}
      
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total MOUs",
            value: stats.totalMOU,
            icon: <FiFileText className="w-6 h-6" />,
            color: "blue",
            loading: loading.stats
          },
          {
            title: "Active MOUs",
            value: stats.activeMOU,
            icon: <FiBarChart2 className="w-6 h-6" />,
            color: "green",
            loading: loading.stats
          },
          {
            title: "Expiring Soon",
            value: stats.expiringSoon,
            icon: <FiAlertTriangle className="w-6 h-6" />,
            color: "yellow",
            loading: loading.stats
          },
          {
            title: "System Users",
            value: stats.users,
            icon: <FiUsers className="w-6 h-6" />,
            color: "purple",
            loading: loading.stats
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className={`p-6 rounded-2xl shadow-md transition-all duration-300 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border-l-4 ${
              stat.color === 'blue' ? 'border-blue-500' :
              stat.color === 'green' ? 'border-green-500' :
              stat.color === 'yellow' ? 'border-yellow-500' : 'border-purple-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.title}
                </p>
                {stat.loading ? (
                  <div className="h-8 w-16 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className={`text-3xl font-bold mt-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                stat.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Add New MOU",
            description: "Create a new memorandum",
            icon: <FiPlus className="w-5 h-5" />,
            color: "blue",
            href: "/add-mou"
          },
          {
            title: "Manage MOUs",
            description: "View and edit all agreements",
            icon: <FiFileText className="w-5 h-5" />,
            color: "green",
            href: "/view-mou"
          },
          {
            title: "Export Data",
            description: "Download reports in Excel",
            icon: <FiDownload className="w-5 h-5" />,
            color: "purple",
            href: "/download-mou"
          },
          {
            title: "System Settings",
            description: "Configure application",
            icon: <FiSettings className="w-5 h-5" />,
            color: "gray",
            href: "/admin/settings"
          }
        ].map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`p-5 rounded-xl transition-all duration-300 group ${
              theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            } border ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            } shadow-sm hover:shadow-md`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${
              action.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
              action.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
              action.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
              'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {action.icon}
            </div>
            <h3 className={`font-semibold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {action.title}
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {action.description}
            </p>
            <div className={`mt-3 flex items-center text-sm font-medium ${
              action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
              action.color === 'green' ? 'text-green-600 dark:text-green-400' :
              action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              Go to page
              <FiChevronRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>
        ))}
      </div>

      {/* Two-column layout for expiring MOUs and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expiring Agreements */}
        <div className={`p-6 rounded-xl transition-all duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiAlertTriangle className="mr-2 text-yellow-500" />
              Expiring Agreements
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {stats.expiringSoon} {stats.expiringSoon === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          
          {loading.mou ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
                theme === 'dark' ? 'border-gray-700 border-t-blue-500' : 'border-gray-200 border-t-blue-600'
              }`}></div>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading agreements...
              </p>
            </div>
          ) : expiringMOU.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FiCalendar className={`w-12 h-12 mb-3 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No expiring agreements
              </h3>
              <p className={`mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                All MOUs are currently up to date
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {expiringMOU.slice(0, 5).map((mou, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  } border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                      } font-medium`}>
                        {mou.instituteName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {mou.instituteName}
                        </h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Expires: {format(parseISO(mou.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRenewMOU(mou.ind+1)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                          : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                      } transition-colors duration-200`}
                    >
                      Renew
                    </button>
                  </div>
                </div>
              ))}
              {expiringMOU.length > 5 && (
                <a 
                  href="/view-mou?filter=expiring" 
                  className={`block text-center mt-4 text-sm font-medium ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  } transition-colors duration-200`}
                >
                  View all expiring agreements →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl transition-all duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FiDatabase className="mr-2 text-purple-500" />
              Recent Activity
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'
            }`}>
              Last 5 actions
            </span>
          </div>
          
          {loading.activity ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
                theme === 'dark' ? 'border-gray-700 border-t-purple-500' : 'border-gray-200 border-t-purple-600'
              }`}></div>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading activity...
              </p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FiFileText className={`w-12 h-12 mb-3 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No recent activity
              </h3>
              <p className={`mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                System activity will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg transition-colors duration-200 ${
                    theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  } border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activity.type === 'create' ? 
                        (theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600') :
                      activity.type === 'update' ? 
                        (theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600') :
                        (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                    }`}>
                      {activity.type === 'create' ? <FiPlus className="w-4 h-4" /> : 
                       activity.type === 'update' ? <FiSettings className="w-4 h-4" /> : 
                       <FiDownload className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {activity.action}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {activity.description}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {format(parseISO(activity.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <a 
                href="/admin/activity-log" 
                className={`block text-center mt-4 text-sm font-medium ${
                  theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
                } transition-colors duration-200`}
              >
                View full activity log →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;