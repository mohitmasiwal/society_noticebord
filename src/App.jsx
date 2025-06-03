 import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Notice from "./components/Notice";
import Header from "./components/Header";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./Redux/AuthSlice";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const savedToken = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (savedToken) {
      dispatch(loginSuccess(savedToken));
    }
    setLoading(false);
  }, [dispatch, savedToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/admin"
          element={
            savedToken ? (
              userRole === "admin" ? (
                <Admin />
              ) : (
                <Notice />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/notice" element={<Notice />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Notice />} />
      </Routes>
    </Router>
  );
}

export default App;
