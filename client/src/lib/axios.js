import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_PORT || "http://localhost:4000",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

