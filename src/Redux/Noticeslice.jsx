 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, push, get, update, remove } from "firebase/database";
import { db } from "../Firebase/Firebase";

 
export const addnotice = createAsyncThunk("notice/addnotice", async (noticedata) => {
  const newRef = await push(ref(db, "notices"), noticedata);
  return { id: newRef.key, ...noticedata };
});

 
export const fetchnotice = createAsyncThunk("notice/fetchnotice", async () => {
  const snapshot = await get(ref(db, "notices"));
  const data = snapshot.val() || {};
  return Object.entries(data).map(([id, notice]) => ({ id, ...notice }));
});

 
export const updatenotice = createAsyncThunk("notice/updatenotice", async ({ id, updatedData }) => {
  await update(ref(db, `notices/${id}`), updatedData);
  return { id, updatedData };
});

 
export const deletenotice = createAsyncThunk("notice/deletenotice", async (id) => {
  await remove(ref(db, `notices/${id}`));
  return id;
});

 
const noticeslice = createSlice({
  name: "notice",
  initialState: {
    notice: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
 
      .addCase(addnotice.fulfilled, (state, action) => {
        state.notice.push(action.payload);
      })

     
      .addCase(fetchnotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchnotice.fulfilled, (state, action) => {
        state.notice = action.payload;
        state.loading = false;
      })
      .addCase(fetchnotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

  
      .addCase(updatenotice.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.notice.findIndex((n) => n.id === id);
        if (index !== -1) {
          state.notice[index] = { ...state.notice[index], ...updatedData };
        }
      })

      
      .addCase(deletenotice.fulfilled, (state, action) => {
        state.notice = state.notice.filter((n) => n.id !== action.payload);
      });
  },
});

export default noticeslice.reducer;
