 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, push, get, update } from "firebase/database";
import { db } from "../Firebase/Firebase";

// Add a problem under a specific userId
export const addProblem = createAsyncThunk(
  "problem/addProblem",
  async ({ userId, problem, username }) => {
    const problemWithDefaults = {
      problem,
      username,
      status: "pending",
      comment: "", // admin comment initially empty
    };

    const newRef = await push(ref(db, `problems/${userId}`), problemWithDefaults);

    return { id: newRef.key, userId, ...problemWithDefaults };
  }
);

// Fetch all problems from all users (flattened with userId)
export const fetchProblems = createAsyncThunk(
  "problem/fetchProblems",
  async () => {
    const snapshot = await get(ref(db, "problems"));
    const data = snapshot.val() || {};

    const problemsArray = [];
    for (const userId in data) {
      for (const id in data[userId]) {
        problemsArray.push({
          id,
          userId,
          ...data[userId][id],
        });
      }
    }

    return problemsArray;
  }
);

// New thunk: Fetch problems only for one userId
export const fetchUserProblems = createAsyncThunk(
  "problem/fetchUserProblems",
  async (userId) => {
    if (!userId) return [];

    const snapshot = await get(ref(db, `problems/${userId}`));
    const data = snapshot.val() || {};

    const problemsArray = Object.entries(data).map(([id, problem]) => ({
      id,
      userId,
      ...problem,
    }));

    return problemsArray;
  }
);

// Update a problem using both userId and problem id
export const updateProblem = createAsyncThunk(
  "problem/updateProblem",
  async ({ userId, id, updates }) => {
    await update(ref(db, `problems/${userId}/${id}`), updates);
    return { userId, id, updates };
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    problems: [],      // all problems from all users
    userProblems: [],  // problems from the current logged-in user
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProblem.fulfilled, (state, action) => {
        state.problems.push(action.payload);
      })
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.problems = action.payload;
        state.loading = false;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        const { userId, id, updates } = action.payload;
        const index = state.problems.findIndex(
          (p) => p.id === id && p.userId === userId
        );
        if (index !== -1) {
          state.problems[index] = {
            ...state.problems[index],
            ...updates,
          };
        }
      })

      // Handling for user-specific problems fetching
      .addCase(fetchUserProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProblems.fulfilled, (state, action) => {
        state.userProblems = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default problemSlice.reducer;
