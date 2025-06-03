 import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchnotice } from "../Redux/Noticeslice";
import { addProblem, fetchUserProblems } from "../Redux/ProblemSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";

const Notice = () => {
  const dispatch = useDispatch();

  const { notice, loading: loadingNotices, error: errorNotices } = useSelector(
    (state) => state.notice
  );
  const {
     
    userProblems,
    loading: loadingProblems,
    error: errorProblems,
  } = useSelector((state) => state.problem);
  const login = useSelector((state) => state.auth.login);

  const [expandedIndex, setExpandedIndex] = useState(null);
  const problemRef = useRef();

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  
  const username = user?.displayName || localStorage.getItem("userName") || "Anonymous";

  useEffect(() => {
    dispatch(fetchnotice());
  }, [dispatch]);

 
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProblems(userId));
    }
  }, [dispatch, userId,addProblem]);

  const toggleNotice = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleProblemSubmit = (e) => {
    e.preventDefault();

    if (!login) {
      toast.error("Please login to add problem.");
      return;
    }

    const problemText = problemRef.current.value.trim();
    if (!problemText) {
      toast.error("Please describe your problem.");
      return;
    }

    dispatch(addProblem({ userId, problem: problemText, username }));
    toast.success("Problem submitted!");

    problemRef.current.value = "";
  };

  return (
    <div className="mt-20 max-w-3xl mx-auto p-6 bg-gray-900 min-h-screen text-gray-100 hover:shadow-amber-300 transition">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-white">
        📢 Announcements for society members
      </h1>

     
      {loadingNotices ? (
        <p className="text-center text-gray-400">Loading notices...</p>
      ) : errorNotices ? (
        <p className="text-center text-red-500">Error loading notices: {errorNotices}</p>
      ) : notice.length === 0 ? (
        <p className="text-center text-gray-400">No notices available yet.</p>
      ) : (
        <div className="space-y-6 mb-14">
          {notice.map((noticeItem, index) => (
            <div
              key={noticeItem.id || index}
              className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-5 border border-gray-600 hover:shadow-indigo-700 transition"
            >
              <button
                type="button"
                onClick={() => toggleNotice(index)}
                className="w-full text-left text-indigo-300 font-semibold text-lg"
                aria-expanded={expandedIndex === index}
                aria-controls={`notice-content-${index}`}
              >
                {/* Replaced deprecated marquee with scrolling animation */}
                <div className="overflow-hidden whitespace-nowrap animate-marquee">
                  🚨 {noticeItem.title}
                </div>
              </button>

              {expandedIndex === index && (
                <div id={`notice-content-${index}`} className="mt-3 text-gray-300">
                  <p className="text-xl font-bold text-white mb-1">🚨 {noticeItem.title}</p>
                  <p className="mb-1">{noticeItem.description}</p>
                  <p className="text-sm text-gray-500">📅 Date: {noticeItem.date}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report a Problem Form */}
      <section className="max-w-xl mx-auto bg-gray-800 p-6 hover:shadow-amber-500 transition rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-semibold mb-5 text-indigo-400 text-center">Report a Problem</h2>
        <form onSubmit={handleProblemSubmit} className="space-y-5">
          <textarea
            placeholder="Describe your problem"
            ref={problemRef}
            rows={4}
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

     
      {login && (
        <section className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-amber-500 transition">
          <h2 className="text-2xl font-semibold mb-5 text-indigo-400 text-center">Your Submitted Problems</h2>

          {loadingProblems ? (
            <p className="text-center text-gray-400">Loading your problems...</p>
          ) : errorProblems ? (
            <p className="text-center text-red-500">Error loading problems: {errorProblems}</p>
          ) : userProblems.length === 0 ? (
            <p className="text-center text-gray-400">No problems submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {userProblems.map(({ id, problem, status, comment }) => (
                <li key={id} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <p className="text-gray-200 font-medium mb-1">{problem}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        status === "pending" ? "text-yellow-400" : "text-green-400"
                      }`}
                    >
                      {status}
                    </span>
                  </p>
                  <p>Comment: {comment || "No comments yet."}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Notice;
