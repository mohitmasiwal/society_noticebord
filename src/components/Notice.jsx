 import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchnotice } from "../Redux/Noticeslice";
import { addProblem, fetchProblems } from "../Redux/ProblemSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notice = () => {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notice?.notice || []);
  const allProblems = useSelector((state) => state.problem?.problems || []);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const problemRef = useRef();
  const mobileRef = useRef();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const userName = user.name || "";
  const userRole = user.userRole || "user";

  // Filter user-submitted problems
  const userProblems = allProblems.filter((p) => p.name === userName);

  useEffect(() => {
    dispatch(fetchnotice());
    dispatch(fetchProblems()); // fetch all problems regardless of role
  }, [dispatch]);

  const toggleNotice = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleProblemSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to report a problem!");
      return;
    }

    const problem = problemRef.current.value.trim();
    const mobile = mobileRef.current.value.trim();

    if (!problem || !mobile) {
      toast.error("Please fill all fields");
      return;
    }

    dispatch(
      addProblem({
        name: userName,
        problem,
        mobile,
        status: "pending",
        adminComment: "",
      })
    );

    toast.success("Problem submitted!");

    problemRef.current.value = "";
    mobileRef.current.value = "";
  };

  return (
    <div className="mt-20 max-w-3xl mx-auto p-6 bg-gray-900 min-h-screen text-gray-100 hover:shadow-amber-300 transition">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-white">
        📢 Announcements for society members
      </h1>

      {/* Notices Section */}
      {notices.length === 0 ? (
        <p className="text-center text-gray-400">No notices available yet.</p>
      ) : (
        <div className="space-y-6 mb-14">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-5 border border-gray-600 hover:shadow-indigo-700 transition"
            >
              <div
                className="cursor-pointer mb-3 text-indigo-300 font-semibold text-lg overflow-hidden whitespace-nowrap animate-marquee"
                onClick={() => toggleNotice(index)}
              >
                <marquee behavior="scroll" direction="left">
                  🚨 {notice.title}
                </marquee>
              </div>

              {expandedIndex === index && (
                <div className="mt-3 text-gray-300">
                  <p className="text-md mb-1 text-xl text-white font-bold">
                    🚨 {notice.title}
                  </p>
                  <p className="text-md mb-1">{notice.description}</p>
                  <p className="text-sm text-gray-500">
                    📅 Date: {notice.date}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Problem Form for Users */}
      {userRole === "user" && (
        <section className="max-w-xl mx-auto bg-gray-800 p-6 hover:shadow-amber-500 transition rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-5 text-indigo-400 text-center">
            Report a Problem
          </h2>
          <form onSubmit={handleProblemSubmit} className="space-y-5">
            <textarea
              placeholder="Describe your problem"
              ref={problemRef}
              rows={4}
              className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              ref={mobileRef}
              className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold transition"
            >
              Submit Problem
            </button>
          </form>
        </section>
      )}

      {/* Submitted Problems List (for users) */}
      {userRole === "user" && userProblems.length > 0 && (
        <section className="mt-10 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-5 text-indigo-300 text-center">
            Your Submitted Problems
          </h2>
          <div className="space-y-4">
            {userProblems.map((p, idx) => (
              <div
                key={idx}
                className="bg-gray-900 p-4 rounded border border-gray-700 hover:shadow-indigo-500 transition"
              >
                <p className="text-gray-200">
                  <strong>Problem:</strong> {p.problem}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      p.status === "pending"
                        ? "text-yellow-400"
                        : "text-green-400"
                    } font-medium`}
                  >
                    {p.status}
                  </span>
                </p>
                {p.adminComment && (
                  <p className="text-sm text-blue-400">
                    <strong>Admin Comment:</strong> {p.adminComment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Notice;
