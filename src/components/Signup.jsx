 import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { ref, set } from "firebase/database";
import { useDispatch } from "react-redux";
import { setError } from "../Redux/AuthSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const codeRef = useRef();
  const nameRef = useRef();

  const dispatch = useDispatch();

  const [role, setRole] = useState("user");
  const VALID_CODE = "SECRET123";

  const handleSignup = async (e) => {
    e.preventDefault();
  const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const code = codeRef.current?.value;

    if (role === "admin" && code !== VALID_CODE) {
      dispatch(setError("Invalid admin signup code."));
      toast.error("Invalid admin signup code.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await set(ref(db, "users/" + uid), {
        name,
        email,
        role,
      });

      toast.success("Account created successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      emailRef.current.value = "";
      passwordRef.current.value = "";
      nameRef.current.value ="";
      if (codeRef.current) codeRef.current.value = "";
      setRole("user");  
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {role === "admin" && (
          <input
            type="text"
            placeholder="Secret Admin Code"
            ref={codeRef}
            required
            className="w-full mb-3 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
        )}
        <input
  type="text"
  placeholder="Name"
  ref={nameRef}
  required
  className="w-full mb-3 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
/>


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
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Signup;
