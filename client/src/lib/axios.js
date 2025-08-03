import axios from "axios";
import Cookies from "js-cookie";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_PORT || "http://localhost:4000",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});