 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, push, get } from "firebase/database";
import { db } from "../Firebase/Firebase";

 
export const addProblem = createAsyncThunk(
  "problem/addProblem",
  async (problemData) => {
    const newRef = await push(ref(db, "problems"), problemData);
    return { id: newRef.key, ...problemData };
  }
);

 
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
      });
  },
});

export default problemSlice.reducer;
