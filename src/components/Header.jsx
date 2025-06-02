 import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthSlice";

const Header = () => {
  const dispatch = useDispatch();
  const login =  useSelector((state)=> state.auth.login)

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");  
  };

  return (
    <header className="  z-50 fixed top-0 left-0 w-full bg-gray-800   hover:shadow-amber-300 transition text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">My Society</h1>

      <nav className="space-x-6 flex items-center">
  {login ? (
    <>
      <Link to="/admin" className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900 transition">
        Admin Panel
      </Link>

      <Link to="/notice" className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900 transition">
        Notice Panel
      </Link>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition ml-4"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/notice" className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900 transition">
        Notice Panel
      </Link>

      <Link to="/login" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
        Login
      </Link>
    </>
  )}
</nav>

    </header>
  );
};

export default Header;
