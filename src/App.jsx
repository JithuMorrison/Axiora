import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import MOUForm from './components/MOU/form';
import MOUList from './components/MOU/list';
import MOUDownload from './components/MOU/download';
import Notifications from './components/notification';
import Navbar from './components/navbar';
import { differenceInMonths, parseISO, format } from 'date-fns';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { getAllMOU } from './utils/excel';
import SheetForm from './sheets';
import PdfManager from './drive';
import axios from 'axios';
import Profile from './components/Auth/profile';
import EmailForm from './email';

const App = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedUser = localStorage.getItem('mouser');
    const storedTheme = localStorage.getItem('mouTrackerTheme');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('mouser', JSON.stringify(user));
    localStorage.setItem('mouTrackerTheme', theme);
    document.documentElement.className = theme;
  }, [user, theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />
        <Notifications />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          toastClassName={`${theme === 'dark' ? '!bg-gray-800 !text-white' : '!bg-white !text-gray-800'} !shadow-xl !rounded-2xl !backdrop-blur-md`}
          progressClassName={`${theme === 'dark' ? '!bg-purple-500' : '!bg-blue-500'}`}
          className="!top-20"
        />
        <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home user={user} theme={theme} />} />
            <Route path="/login" element={<Login setUser={setUser} theme={theme} />} />
            <Route path="/register" element={<Register setUser={setUser} theme={theme} />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard theme={theme}>
                  <div className="mb-8">
                    <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500'}`}>
                      Welcome back, {user?.name}
                    </h2>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Your MOU management dashboard
                    </p>
                  </div>
                </Dashboard>
              }
            />
            <Route
              path="/admindash"
              element={
                <AdminDashboard theme={theme}>
                  <div className="mb-8">
                    <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500'}`}>
                      Welcome back, {user?.name}
                    </h2>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Your Admin dashboard
                    </p>
                  </div>
                </AdminDashboard>
              }
            />
            <Route path="/add-mou" element={<MOUForm user={user} theme={theme} />} />
            <Route path="/view-mou" element={<MOUList theme={theme} />} />
            <Route path="/download-mou" element={<MOUDownload theme={theme} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} theme={theme} />} />
          </Routes>
        </div>
        <Footer theme={theme} />
      </div>
    </Router>
  );
};

const Home = ({ user, theme }) => (
  <div className="w-full overflow-x-hidden">
    <div className={`flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 min-h-[80vh] ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mb-12 md:mb-0 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          <span className={theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500'}>
            Streamline
          </span> Your MOU Management
        </h1>
        <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Automated tracking, intelligent alerts, and seamless collaboration for your institutional agreements
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className={`px-6 py-3 rounded-lg font-semibold text-center transition-all shadow-md ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white'
              }`}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`px-6 py-3 rounded-lg font-semibold text-center transition-all shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white'
                }`}
              >
                Get Started
              </Link>
              <Link 
                to="/register" 
                className={`px-6 py-3 rounded-lg font-semibold text-center transition-all ${
                  theme === 'dark' 
                    ? 'border border-blue-400 text-blue-400 hover:bg-blue-900/30' 
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="relative w-full md:w-1/2 h-96 md:h-[500px]">
        <div className="absolute w-full h-full">
          <div className={`absolute w-64 h-40 top-0 left-0 rotate-[-5deg] rounded-2xl shadow-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-500/80 to-blue-600/80 border border-blue-400/20' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-200'
          }`}></div>
          <div className={`absolute w-56 h-80 top-24 left-48 md:left-48 rotate-[3deg] rounded-2xl shadow-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-purple-500/80 to-blue-600/80 border border-purple-400/20' 
              : 'bg-gradient-to-br from-purple-500 to-blue-600 border border-purple-200'
          }`}></div>
          <div className={`absolute w-60 h-56 top-60 left-24 rotate-[-2deg] rounded-2xl shadow-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-pink-500/80 to-red-500/80 border border-pink-400/20' 
              : 'bg-gradient-to-br from-pink-500 to-red-500 border border-pink-200'
          }`}></div>
        </div>
      </div>
    </div>
    
    <div className={`py-16 px-4 md:px-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500'
          }`}>
            Powerful Features
          </h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need for effective MOU management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                </svg>
              ),
              title: "Easy Data Entry",
              description: "Intuitive forms with auto-save and validation"
            },
            {
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              ),
              title: "Smart Tracking",
              description: "Automated expiry alerts and renewal reminders"
            },
            {
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
                </svg>
              ),
              title: "Advanced Analytics",
              description: "Visual reports and data export capabilities"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700/50 hover:border-blue-400/30 border border-gray-600/20 hover:-translate-y-1' 
                  : 'bg-white hover:border-blue-200 border border-gray-200 hover:-translate-y-1'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                theme === 'dark' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>{feature.title}</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = ({ children, theme }) => {
  const [mou, setMOU] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('moudetails');
        const allMOU = JSON.parse(storedData) || [];

        const currentDate = new Date();
        const expiringMOU = allMOU.filter(mou => {
          if (!mou.endDate) return false;
          const endDate = parseISO(mou.endDate);
          return differenceInMonths(endDate, currentDate) <= 1;
        });
        
        setMOU(expiringMOU);
      } catch (error) {
        console.error("Error loading MOU data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {children}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Add New MOU</h3>
          </div>
          <p className="text-gray-600 mb-4">Enter details of new Memorandum of Understanding</p>
          <a href="/add-mou" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition">
            Go to Form
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">View MOU Records</h3>
          </div>
          <p className="text-gray-600 mb-4">Browse and search existing MOU records</p>
          <a href="/view-mou" className="inline-flex items-center text-green-600 font-medium hover:text-green-800 transition">
            View Records
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Download Data</h3>
          </div>
          <p className="text-gray-600 mb-4">Export MOU data to Excel with filters</p>
          <a href="/download-mou" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition">
            Download
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-700/50 border border-gray-600/20' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Expiring Agreements</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            theme === 'dark' 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-red-100 text-red-800'
          }`}>
            {mou.length} {mou.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
              theme === 'dark' 
                ? 'border-gray-600 border-t-blue-400' 
                : 'border-gray-200 border-t-blue-500'
            }`}></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading agreements data...
            </p>
          </div>
        ) : mou.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg 
              className={`w-16 h-16 mb-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-300'
              }`} 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
            <h3 className={`text-xl font-medium mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>No expiring agreements</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              All your MOUs are up to date
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className={`min-w-full grid grid-cols-12 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            } rounded-lg p-4 mb-2 font-medium`}>
              <div className="col-span-5">Institution</div>
              <div className="col-span-3">Signed By</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-2">Status</div>
            </div>
            <div className="space-y-2">
              {mou.map((item, index) => (
                <div 
                  key={index} 
                  className={`min-w-full grid grid-cols-12 items-center p-4 rounded-lg transition-all ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700/80' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-5 flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium ${
                      theme === 'dark' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.instituteName.charAt(0).toUpperCase()}
                    </div>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {item.instituteName}
                    </span>
                  </div>
                  <div className={`col-span-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.signedBy}
                  </div>
                  <div className={`col-span-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {format(parseISO(item.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      Expiring Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <EmailForm/>
    </div>
  );
};

const AdminDashboard = ({ children, theme }) => {
  const [mou, setMOU] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/sheet-data1');
        const allMOU = response.data.values.map(row => ({
          instituteName: row[0] || '',
          startDate: row[1] || '',
          endDate: row[2] || '',
          signedBy: row[3] || '',
          facultyDetails: row[4] || '',
          academicYear: row[5] || '',
          purpose: row[6] || '',
          outcomes: row[7] || '',
          agreementFileId: row[8] || '',
          fileName: row[9] || '',
          createdBy: row[10] || '',
          createdAt: row[11] || ''
        }));

        const currentDate = new Date();
        const expiringMOU = allMOU.filter(mou => {
          if (!mou.endDate) return false;
          const endDate = parseISO(mou.endDate);
          return differenceInMonths(endDate, currentDate) <= 1;
        });
        
        setMOU(expiringMOU);
      } catch (error) {
        console.error("Error loading MOU data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {children}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Add New MOU</h3>
          </div>
          <p className="text-gray-600 mb-4">Enter details of new Memorandum of Understanding</p>
          <a href="/add-mou" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition">
            Go to Form
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">View MOU Records</h3>
          </div>
          <p className="text-gray-600 mb-4">Browse and search existing MOU records</p>
          <a href="/view-mou" className="inline-flex items-center text-green-600 font-medium hover:text-green-800 transition">
            View Records
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Download Data</h3>
          </div>
          <p className="text-gray-600 mb-4">Export MOU data to Excel with filters</p>
          <a href="/download-mou" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition">
            Download
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-700/50 border border-gray-600/20' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Expiring Agreements</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            theme === 'dark' 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-red-100 text-red-800'
          }`}>
            {mou.length} {mou.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
              theme === 'dark' 
                ? 'border-gray-600 border-t-blue-400' 
                : 'border-gray-200 border-t-blue-500'
            }`}></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading agreements data...
            </p>
          </div>
        ) : mou.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg 
              className={`w-16 h-16 mb-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-300'
              }`} 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
            <h3 className={`text-xl font-medium mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>No expiring agreements</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              All your MOUs are up to date
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className={`min-w-full grid grid-cols-12 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            } rounded-lg p-4 mb-2 font-medium`}>
              <div className="col-span-5">Institution</div>
              <div className="col-span-3">Signed By</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-2">Status</div>
            </div>
            <div className="space-y-2">
              {mou.map((item, index) => (
                <div 
                  key={index} 
                  className={`min-w-full grid grid-cols-12 items-center p-4 rounded-lg transition-all ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700/80' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-5 flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium ${
                      theme === 'dark' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.instituteName.charAt(0).toUpperCase()}
                    </div>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {item.instituteName}
                    </span>
                  </div>
                  <div className={`col-span-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.signedBy}
                  </div>
                  <div className={`col-span-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {format(parseISO(item.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      Expiring Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white pt-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 border-b border-white/20 pb-12 mb-10">
          {/* Brand + Description */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              MOUTracker
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              A vibrant, secure, and seamless solution to manage your MOUs,
              institutional collaborations, and partnerships with ease.
            </p>
            <div className="flex space-x-4 mt-4 text-xl">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-blue-300 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-sky-300 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-blue-200 transition"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="hover:text-gray-200 transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {[
            {
              title: "Product",
              links: [
                { name: "Features", href: "/features" },
                { name: "Pricing", href: "/pricing" },
                { name: "Updates", href: "/updates" },
              ],
            },
            {
              title: "Company",
              links: [
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Careers", href: "/careers" },
              ],
            },
            {
              title: "Resources",
              links: [
                { name: "Help Center", href: "/help" },
                { name: "Documentation", href: "/docs" },
                { name: "API Access", href: "/api" },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/90 hover:text-white underline-offset-2 hover:underline transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80 pb-10">
          <p>
            © {new Date().getFullYear()} MOUTracker. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;