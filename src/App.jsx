import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import MOUForm from './components/MOU/form';
import MOUList from './components/MOU/list';
import MOUDownload from './components/MOU/download';
import Notifications from './components/notification';
import Navbar from './components/navbar';
import { differenceInMonths, parseISO, format } from 'date-fns';
import { getAllMOU } from './utils/excel';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (simple session management)
    const storedUser = localStorage.getItem('mouTrackerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mouTrackerUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mouTrackerUser');
    }
  }, [user]);

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <Notifications />
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard>
                  <h2>Welcome, {user?.name}</h2>
                  <p>Manage your MOU data efficiently</p>
                </Dashboard>
              }
            />
            <Route path="/add-mou" element={<MOUForm user={user} />} />
            <Route path="/view-mou" element={<MOUList />} />
            <Route path="/download-mou" element={<MOUDownload />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Home = () => (
  <div className="home">
    <h1>MOUTracker</h1>
    <p>Automated MOU Data Management System</p>
  </div>
);

const Dashboard = ({ children }) => {
  const [mou,setMOU] = useState([]);
  useEffect(() => {
    const allMOU = getAllMOU();
    const currentDate = new Date();

    const expiringMOU = [];

    allMOU.forEach(mou => {
      const endDate = parseISO(mou.endDate);
      const monthsRemaining = differenceInMonths(endDate, currentDate);

      if (monthsRemaining <= 1) {
        expiringMOU.push(mou);
      }
    });
    setMOU(expiringMOU);
  }, []);

  return (
    <div className="dashboard">
      {children}
      <div className="dashboard-cards">
        <div className="card">
          <h3>Add New MOU</h3>
          <p>Enter details of new Memorandum of Understanding</p>
          <a href="/add-mou" className="card-link">Go to Form</a>
        </div>
        <div className="card">
          <h3>View MOU Records</h3>
          <p>Browse and search existing MOU records</p>
          <a href="/view-mou" className="card-link">View Records</a>
        </div>
        <div className="card">
          <h3>Download Data</h3>
          <p>Export MOU data to Excel with filters</p>
          <a href="/download-mou" className="card-link">Download</a>
        </div>
      </div>
      <div>
        <h2>Expiring MOUs</h2>
        {mou.length === 0 ? (
          <p>No MOUs expiring within a month.</p>
        ) : (
          <ul>
            {mou.map((item, index) => (
              <li key={index}>
                <strong>{item.instituteName}</strong> – Expires on {format(parseISO(item.endDate), 'MMM d, yyyy')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;