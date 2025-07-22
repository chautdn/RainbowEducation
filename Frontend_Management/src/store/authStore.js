import { create } from "zustand";
import axiosInstance from "../components/utils/AxiosInstance";
import useErrorStore from './errorStore';
const API_URL = "/user";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // Add checkAuth function to verify stored token
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        return;
      }

      // Verify token with backend
      const response = await axiosInstance.get(`${API_URL}/profile`);
      
      if (response.data?.status === 'success' && response.data?.data?.user) {
        set({
          isAuthenticated: true,
          user: response.data.data.user,
          isCheckingAuth: false,
          error: null
        });
        console.log("Auth restored from token:", response.data.data.user);
      } else {
        // Invalid token, clear it
        localStorage.removeItem("token");
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Token is invalid, clear it
      localStorage.removeItem("token");
      set({ 
        isCheckingAuth: false, 
        isAuthenticated: false, 
        user: null,
        error: null // Don't show error for failed token verification
      });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });
  
      const user = response.data.data?.user || null;
      set({
        user: user,
        isAuthenticated: false, // Still need email verification
        isLoading: false,
        message: response.data.message || "Signup successful. Please verify your email.",
      });
  
      return response.data;
    } catch (error) {
      useErrorStore.getState().setError(error.displayMessage);
      set({ isLoading: false });
      throw error;
    }
  },  

  verifyEmail: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/verify-email`, {
        email,
        otp,
      });
      
      // After email verification, also get user data and token
      const user = response.data?.data?.user || null;
      const token = response.data?.jwt || response.data?.data?.token || response.data?.token || null;
      
      if (token) {
        localStorage.setItem("token", token);
      }
      
      set({
        isAuthenticated: true,
        user: user,
        isLoading: false,
        message: "Email verified successfully",
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axiosInstance.post(
        `${API_URL}/resend-verification`,
        {
          email,
        }
      );
      set({
        isLoading: false,
        message: "Verification code resent successfully",
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to resend verification code",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, {
        email,
        password,
      });
  
      const user = response.data?.data?.user || null;
      const token = response.data?.jwt || response.data?.data?.token || response.data?.token || null;
  
      if (user && token) {
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null
        });
  
        // Store token in localStorage after successful login
        localStorage.setItem("token", token);
        console.log("Login successful, token saved:", token);
        console.log("User logged in:", user);
      } else {
        set({ 
          isLoading: false,
          error: "Login failed. Please check your credentials and try again."
        });
      }
  
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      set({ 
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  // Google login
  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/google-login`, {
        credential,
      });

      // Store user data and token
      set({
        isAuthenticated: true,
        user: response.data.data.user,
        error: null,
        isLoading: false,
      });

      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in with Google",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`${API_URL}/logout`);
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if server request fails
    } finally {
      // Always clear local state and token
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/reset-password/${token}`,
        {
          password,
        }
      );
      set({
        message: response.data.message,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));