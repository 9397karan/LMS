import React, { useState } from "react";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loader from "@/component/Loader"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false); 
  const [showLoaderFor3Secs, setShowLoaderFor3Secs] = useState(false); 
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowLoaderFor3Secs(true);

    setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await api.post("/user/login", formData);
        toast.success(data.message);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data?.message || "Login failed. Please try again.");
        } else if (error.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false); 
        setShowLoaderFor3Secs(false); 
      }
    }, 3000); 
  };

  return user ? (
    <Navigate to="/" />
  ) : (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 `}>
      {/* Show the loader only for 3 seconds */}
      {showLoaderFor3Secs && <Loader />}
      {!showLoaderFor3Secs && (
        <form className="p-6 bg-white shadow-lg rounded-md" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border mb-4 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
