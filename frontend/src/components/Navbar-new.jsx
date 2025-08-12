import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearUserData, isAdmin } from '../utils';

const NavbarComponent = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminStatus, setAdminStatus] = useState(isAdmin());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setAdminStatus(isAdmin());
  }, [token]);

  const handleLogout = () => {
    clearUserData();
    setAdminStatus(false);
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse" onClick={closeMenu}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-motorcycle text-white text-sm"></i>
          </div>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            RideCircle
          </span>
        </Link>

        {/* Mobile menu button and dark mode toggle */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
          >
            {darkMode ? (
              <i className="fas fa-sun w-5 h-5"></i>
            ) : (
              <i className="fas fa-moon w-5 h-5"></i>
            )}
          </button>

          {token ? (
            <div className="flex items-center space-x-3">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-xs"></i>
                  </div>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 z-50">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">Welcome!</span>
                      {adminStatus && (
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          <i className="fas fa-crown text-yellow-500 mr-1"></i>Administrator
                        </span>
                      )}
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          onClick={closeMenu}
                        >
                          <i className="fas fa-user mr-2"></i>Profile
                        </Link>
                      </li>
                      {adminStatus && (
                        <>
                          <li>
                            <Link
                              to="/clubs/add"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                              onClick={closeMenu}
                            >
                              <i className="fas fa-plus mr-2"></i>Add Club
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/trips/add"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                              onClick={closeMenu}
                            >
                              <i className="fas fa-route mr-2"></i>Add Trip
                            </Link>
                          </li>
                        </>
                      )}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          <i className="fas fa-sign-out-alt mr-2"></i>Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <i className="fas fa-sign-in-alt mr-1"></i>Login
              </Link>
              <Link
                to="/register"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >
                <i className="fas fa-user-plus mr-1"></i>Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} w-5 h-5`}></i>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/clubs"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                onClick={closeMenu}
              >
                <i className="fas fa-users mr-2 md:mr-0"></i>
                <span className="md:ml-1">Clubs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/trips"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                onClick={closeMenu}
              >
                <i className="fas fa-route mr-2 md:mr-0"></i>
                <span className="md:ml-1">Trips</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                onClick={closeMenu}
              >
                <i className="fas fa-star mr-2 md:mr-0"></i>
                <span className="md:ml-1">Reviews</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
