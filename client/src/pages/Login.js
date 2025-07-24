import React, { useState } from "react";
import InputFrom from "../components/shared/InputFrom";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import Spinner from "../components/shared/Spinner";
import { toast } from "react-toastify";
import { setUser } from "../redux/features/auth/authSlice"; // 🔥 Đảm bảo bạn đã import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());

      // Call login API
      const { data } = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Login Successfully");

        // Fetch user info
        const userRes = await axios.post(
          "/api/v1/user/getUser",
          {},
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (userRes.data.success) {
          dispatch(setUser(userRes.data.data));
          localStorage.setItem("user", JSON.stringify(userRes.data.data)); // 👉 nếu cần cho Layout
        }

        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }

      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="form-container">
          <form className="card p-2" onSubmit={handleSubmit}>
            <img
              src="/assets/images/logo/logo.png"
              alt="logo"
              height={150}
              width={400}
            />

            <InputFrom
              htmlFor="email"
              labelText="Email"
              type="email"
              name="email"
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
            />
            <InputFrom
              htmlFor="password"
              labelText="Password"
              type="password"
              name="password"
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
            />

            <div className="d-flex justify-content-between">
              <p>
                Not a user? <Link to="/register">Register Here!</Link>
              </p>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
