import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-backened-mr34.onrender.com", 
  withCredentials: true,
});

export default api;
