 import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchnotice } from "../Redux/Noticeslice";
import { addProblem } from "../Redux/ProblemSlice";  
import { toast } from "react-toastify";

const Notice = () => {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notice?.notice || []);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const nameRef = useRef();
  const problemRef = useRef();

  useEffect(() => {
    dispatch(fetchnotice());
  }, [dispatch]);

  const toggleNotice = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleProblemSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const problem = problemRef.current.value.trim();

    if (!name || !problem) {
      toast.error("Please enter your name and problem.");
      return;
    }

    dispatch(addProblem({ name, problem }));
    toast.success("Problem submitted!");

    nameRef.current.value = "";
    problemRef.current.value = "";
  };

  return (
    <div className=" mt-20 max-w-3xl mx-auto p-6 bg-gray-900 min-h-screen text-gray-100  hover:shadow-amber-300 transition ">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-white">
        📢 Announcements for society members
      </h1>

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
                  <p className="text-md mb-1 text-xl text-white font-bold">  🚨 {notice.title}</p>
                  <p className="text-md mb-1">{notice.description}</p>
                  <p className="text-sm text-gray-500">📅 Date: {notice.date}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

 
      <section className="max-w-xl mx-auto bg-gray-800 p-6 hover:shadow-amber-500 transition rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-indigo-400 text-center">
          Report a Problem
        </h2>
        <form onSubmit={handleProblemSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            ref={nameRef}
            className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            required
          />
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
    </div>
  );
};

export default Notice;
