import axios from "axios";
import { BASE_URL } from "./Constant";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", //Dữ liệu gửi đi dạng JSON
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request interceptor");
    console.log(token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Check for token in different possible locations
    const token = response.data?.jwt || response.data?.data?.token || response.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token saved:", token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on authentication error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;