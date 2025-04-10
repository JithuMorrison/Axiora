import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="w-full shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          <Link to="/">MOUTracker</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm items-center font-medium">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600 transition">
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

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          {/* Future Mobile Menu Toggle Here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
