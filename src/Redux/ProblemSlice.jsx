 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, push, get, update, ref as dbRef } from "firebase/database";
import { db } from "../Firebase/Firebase";

// Add a new problem
export const addProblem = createAsyncThunk(
  "problem/addProblem",
  async (problemData) => {
    // problemData should include: name, problem, mobile, status, adminComment, userComment
    const newRef = await push(ref(db, "problems"), problemData);
    return { id: newRef.key, ...problemData };
  }
);

// Fetch all problems
export const fetchProblems = createAsyncThunk(
  "problem/fetchProblems",
  async () => {
    const snapshot = await get(ref(db, "problems"));
    const data = snapshot.val() || {};

    const problemsArray = Object.entries(data).map(([id, problem]) => ({
      id,
      ...problem,
    }));
    return problemsArray;
  }
);

// Update problem by id with partial updates (status, comments, mobile, etc.)
export const updateProblem = createAsyncThunk(
  "problem/updateProblem",
  async ({ id, updates }) => {
    await update(dbRef(db, `problems/${id}`), updates);
    return { id, updates };
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    problems: [],
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
        const { id, updates } = action.payload;
        const index = state.problems.findIndex((p) => p.id === id);
        if (index !== -1) {
          state.problems[index] = {
            ...state.problems[index],
            ...updates,
          };
        }
      });
  },
});

export default problemSlice.reducer;
