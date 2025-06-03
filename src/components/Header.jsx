 import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthSlice";

const Header = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.auth.login);

  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <header className="z-50 fixed top-0 left-0 w-full bg-gray-800 hover:shadow-amber-300 transition text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">My Society</h1>

      <nav className="space-x-6 flex items-center">
        {/* Admin Panel only for admin role */}
        {login && userRole === "admin" && (
          <Link
            to="/admin"
            className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900 transition"
          >
            Admin Panel
          </Link>
        )}

        {/* Notice Panel visible always */}
        <Link
          to="/notice"
          className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900 transition"
        >
          Notice Panel
        </Link>

        {/* Login or Logout buttons */}
        {login ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition ml-4"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Login
            </Link>
            
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
