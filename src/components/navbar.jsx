import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mouser');
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className="w-full shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          <Link to="/">MOUTracker</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-sm">
          {user ? (
            <>
              <Link to={user.role == 'user' ? "/dashboard" : "/admindash"} className="hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link to="/add-mou" className="hover:text-blue-600 transition">
                Add MOU
              </Link>
              <Link to="/view-mou" className="hover:text-blue-600 transition">
                View MOUs
              </Link>
              <Link to="/download-mou" className="hover:text-blue-600 transition">
                Download
              </Link>
              <Link  to="/profile"  className={'block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'} >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1.5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
              >
                Logout
              </button>
              <div className="flex items-center gap-2 ml-2">
                <FaUserCircle className="text-lg" />
                <span className="text-sm font-medium">{user?.name || "User"}</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            className="text-xl text-blue-600 dark:text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4 space-y-3 text-sm font-medium transition-all">
          {user ? (
            <>
              <Link to={user.role == 'user' ? "/dashboard" : "/admindash"} onClick={toggleMobileMenu} className="block hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/add-mou" onClick={toggleMobileMenu} className="block hover:text-blue-600">
                Add MOU
              </Link>
              <Link to="/view-mou" onClick={toggleMobileMenu} className="block hover:text-blue-600">
                View MOUs
              </Link>
              <Link to="/download-mou" onClick={toggleMobileMenu} className="block hover:text-blue-600">
                Download
              </Link>
              <Link  to="/profile"  className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`} >
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="w-full text-left text-red-500 hover:text-red-600"
              >
                Logout
              </button>
              <div className="flex items-center gap-2 mt-2">
                <FaUserCircle className="text-lg" />
                <span>{user?.name || "User"}</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMobileMenu} className="block hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMobileMenu}
                className="block text-white bg-blue-600 px-4 py-2 rounded-full text-center hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
