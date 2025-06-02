import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/AuthSlice"
import noticeReducer from "../Redux/Noticeslice"
import   problemReducer from "../Redux/ProblemSlice"

const store = configureStore({
reducer:{

    auth:  authReducer,
     notice: noticeReducer,
     problem: problemReducer,
}

})
export default store;