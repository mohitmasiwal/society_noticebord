 import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import {
  addnotice,
  fetchnotice,
  updatenotice,
  deletenotice,
} from "../Redux/Noticeslice";

import { fetchProblems, updateProblem } from "../Redux/ProblemSlice";
import { toast } from "react-toastify";

const Admin = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const dateRef = useRef();

  const dispatch = useDispatch();
  const { notice, loading, error } = useSelector((state) => state.notice);
  const {
    problems,
    loading: loadingProblems,
    error: errorProblems,
  } = useSelector((state) => state.problem);

  const [editId, setEditId] = useState(null);
  const [commentStates, setCommentStates] = useState({});
  const [updatingStatusIds, setUpdatingStatusIds] = useState(new Set());
  const [updatingCommentIds, setUpdatingCommentIds] = useState(new Set());

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    dispatch(fetchnotice());
    dispatch(fetchProblems());
  }, [dispatch]);

  useEffect(() => {
    // Initialize comment states from problems
    const initialComments = {};
    problems.forEach(
      (p) => (initialComments[`${p.id}_${p.userId}`] = p.comment || "")
    );
    setCommentStates(initialComments);
  }, [problems]);

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
      dispatch(updatenotice({ id: editId, updatedNotice: data }))
        .unwrap()
        .then(() => {
          toast.success("Notice updated!");
          setEditId(null);
          titleRef.current.value = "";
          descriptionRef.current.value = "";
          dateRef.current.value = "";
        })
        .catch(() => toast.error("Failed to update notice."));
    } else {
      dispatch(addnotice(data))
        .unwrap()
        .then(() => {
          toast.success("Notice added!");
          titleRef.current.value = "";
          descriptionRef.current.value = "";
          dateRef.current.value = "";
        })
        .catch(() => toast.error("Failed to add notice."));
    }
  };

  const handleEdit = (notice) => {
    setEditId(notice.id);
    titleRef.current.value = notice.title;
    descriptionRef.current.value = notice.description;
    dateRef.current.value = notice.date;
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this notice? This action cannot be undone."
      )
    ) {
      dispatch(deletenotice(id))
        .unwrap()
        .then(() => toast.info("Notice deleted."))
        .catch(() => toast.error("Failed to delete notice."));
    }
  };

  const handleStatusChange = (problem, newStatus) => {
    const key = `${problem.id}_${problem.userId}`;
    setUpdatingStatusIds((prev) => new Set(prev).add(key));

    dispatch(
      updateProblem({
        userId: problem.userId,
        id: problem.id,
        updates: { status: newStatus },
      })
    )
      .unwrap()
      .then(() => toast.success("Status updated"))
      .catch(() => toast.error("Failed to update status"))
      .finally(() => {
        setUpdatingStatusIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      });
  };

  const handleCommentUpdate = (problem) => {
    const key = `${problem.id}_${problem.userId}`;
    const newComment = commentStates[key] || "";

    if (newComment.trim() === problem.comment) {
      toast.info("No changes to update.");
      return;
    }

    setUpdatingCommentIds((prev) => new Set(prev).add(key));

    dispatch(
      updateProblem({
        userId: problem.userId,
        id: problem.id,
        updates: { comment: newComment },
      })
    )
      .unwrap()
      .then(() => toast.success("Comment updated"))
      .catch(() => toast.error("Failed to update comment"))
      .finally(() => {
        setUpdatingCommentIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-400">
        Admin Notice Panel
      </h2>

      <section className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mb-10 hover:shadow-amber-300 transition">
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Notice form">
          <label className="block">
            <span className="text-gray-300 mb-1 block">Title</span>
            <input
              type="text"
              placeholder="Title"
              ref={titleRef}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 mb-1 block">Description</span>
            <textarea
              placeholder="Description"
              ref={descriptionRef}
              required
              rows={4}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-300 mb-1 block">Date</span>
            <input
              type="date"
              ref={dateRef}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded font-semibold"
            aria-label={editId ? "Update Notice" : "Add Notice"}
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
                className="p-5 bg-gray-800 rounded shadow flex justify-between items-start hover:shadow-amber-300 transition"
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
                    aria-label={`Edit notice titled ${item.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
                    aria-label={`Delete notice titled ${item.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submitted Problems Section */}
      <section className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
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
          <ul className="space-y-4" aria-label="Submitted problems list">
            {problems.map((problem) => {
              const key = `${problem.id}_${problem.userId}`;
              return (
                <li
                  key={key}
                  className="bg-gray-700 rounded p-4 border border-gray-600 space-y-2"
                  aria-live="polite"
                >
                  <p className="font-semibold text-indigo-400">Name: {problem.username}</p>
                  <p className="text-gray-300">Mobile: {problem.mobile || "N/A"}</p>
                  <p className="text-gray-300">Problem: {problem.problem}</p>
                  <p className="text-sm text-yellow-400">Status: {problem.status}</p>
                  <p className="text-sm text-gray-400">Comment: {problem.comment}</p>

                  <div className="mt-3 space-y-2">
                    <label htmlFor={`status-select-${key}`} className="sr-only">
                      Update status for problem by {problem.username}
                    </label>
                    <select
                      id={`status-select-${key}`}
                      value={problem.status}
                      onChange={(e) => handleStatusChange(problem, e.target.value)}
                      className="px-2 py-1 rounded bg-gray-800 border border-gray-500 text-white"
                      disabled={updatingStatusIds.has(key)}
                      aria-busy={updatingStatusIds.has(key)}
                      aria-live="polite"
                    >
                      <option value="pending">Pending</option>
                      <option value="fulfilled">Fulfilled</option>
                    </select>

                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        aria-label={`Admin comment for problem by ${problem.username}`}
                        value={commentStates[key] || ""}
                        onChange={(e) =>
                          setCommentStates({
                            ...commentStates,
                            [key]: e.target.value,
                          })
                        }
                        placeholder="Add admin comment"
                        className="flex-grow px-2 py-1 rounded bg-gray-800 border border-gray-500 text-white"
                        disabled={updatingCommentIds.has(key)}
                      />
                      <button
                        onClick={() => handleCommentUpdate(problem)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white font-semibold"
                        disabled={updatingCommentIds.has(key)}
                        aria-label={`Post comment for problem by ${problem.username}`}
                      >
                        {updatingCommentIds.has(key) ? "Posting..." : "POST"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Admin;
