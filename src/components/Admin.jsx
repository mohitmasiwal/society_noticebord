 import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addnotice,
  fetchnotice,
  updatenotice,
  deletenotice,
} from "../Redux/Noticeslice";

import { fetchProblems } from "../Redux/ProblemSlice";  
import { toast } from "react-toastify";

const Admin = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const dateRef = useRef();

  const dispatch = useDispatch();
  const { notice, loading, error } = useSelector((state) => state.notice);
  const { problems, loading: loadingProblems, error: errorProblems } = useSelector(
    (state) => state.problem  
  );

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchnotice());
    dispatch(fetchProblems());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const date = dateRef.current.value;

    if (!title || !description || !date) {
      toast.error("Please fill all notice fields.");
      return;
    }

    const data = { title, description, date };

    if (editId) {
      dispatch(updatenotice({ id: editId, updatedNotice: data }));
      toast.success("Notice updated!");
      setEditId(null);
    } else {
      dispatch(addnotice(data));
      toast.success("Notice added!");
    }

    titleRef.current.value = "";
    descriptionRef.current.value = "";
    dateRef.current.value = "";
  };

  const handleEdit = (notice) => {
    setEditId(notice.id);
    titleRef.current.value = notice.title;
    descriptionRef.current.value = notice.description;
    dateRef.current.value = notice.date;
  };

  const handleDelete = (id) => {
    dispatch(deletenotice(id));
    toast.info("Notice deleted.");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-400">
        Admin Notice Panel
      </h2>

      <section className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mb-10  hover:shadow-amber-300 transition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            ref={titleRef}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Description"
            ref={descriptionRef}
            required
            rows={4}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            ref={dateRef}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded font-semibold"
          >
            {editId ? "Update Notice" : "Add Notice"}
          </button>
        </form>
      </section>

      <section className="max-w-4xl mx-auto mb-16">
        {loading ? (
          <p className="text-center text-gray-400">Loading notices...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : notice.length === 0 ? (
          <p className="text-center text-gray-400">No notices available.</p>
        ) : (
          <div className="space-y-6">
            {notice.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-gray-800 rounded shadow flex justify-between items-start   hover:shadow-amber-300 transition"
              >
                <div>
                  <h4 className="text-lg font-bold text-indigo-300">{item.title}</h4>
                  <p className="mt-1 text-gray-300">{item.description}</p>
                  <p className="mt-1 text-sm text-gray-500">Date: {item.date}</p>
                </div>
                <div className="space-x-3 mt-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-gray-900 font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

  
     
        <h2 className="text-2xl font-semibold mb-6 text-indigo-300 text-center">
          Submitted Problems
        </h2>
        {loadingProblems ? (
          <p className="text-center text-gray-400">Loading problems...</p>
        ) : errorProblems ? (
          <p className="text-center text-red-500">Error: {errorProblems}</p>
        ) : problems.length === 0 ? (
          <p className="text-center text-gray-400">No problems submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {problems.map((problem) => (
              <li
                key={problem.id}
                className="bg-gray-700 rounded p-4 border border-gray-600"
              >
                <p className="font-semibold text-indigo-400">Name: {problem.name}</p>
                <p className="mt-1 text-gray-300">Problem: {problem.problem}</p>
                
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Admin;
