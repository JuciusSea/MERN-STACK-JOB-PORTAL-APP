import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";
import Spinner from "./shared/Spinner";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post(
        "/api/v1/user/getUser",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (data.success) {
        dispatch(setUser(data.data));
        setIsAuthenticated(true);
      } else {
        localStorage.clear();
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.clear();
      dispatch(hideLoading());
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) return <Spinner />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
