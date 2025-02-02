import React, { useState } from "react";
import api from "../utils/api";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
const Register = () => {
  const user = localStorage.getItem("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", 
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/register", formData);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return user ? <Navigate to="/"/>:(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="p-6 bg-white shadow-lg rounded-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
        />
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
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
        >
        <option>Select Option</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit"   className="w-full bg-blue-500 text-white py-2 rounded" >
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
