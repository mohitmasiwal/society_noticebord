 import React, { useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../Redux/AuthSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
   const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    dispatch(loginStart());

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.accessToken;

      dispatch(loginSuccess(token));
       navigate("/")
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
          required
          className="w-full mb-3 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          required
          className="w-full mb-3 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          New admin?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Signup here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
