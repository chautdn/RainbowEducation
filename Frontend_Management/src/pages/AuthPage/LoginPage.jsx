import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/authPageComponents/Input";
import { useAuthStore } from "../../store/authStore";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const hasCheckedAuth = useRef(false);

  const { login, isLoading, error, googleLogin, isAuthenticated, isCheckingAuth, checkAuth } =
    useAuthStore();

  // Get redirect info from location state
  const from = location.state?.from || "/home";
  const message = location.state?.message;

  // Stabilize navigate function
  const stableNavigate = useCallback((path, options) => {
    navigate(path, options);
  }, [navigate]);

  // Check auth on mount (only once)
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  useEffect(() => {
    // Check if user is already authenticated (after auth check is complete)
    if (!isCheckingAuth && isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      stableNavigate(from);
    }
  }, [isAuthenticated, isCheckingAuth, stableNavigate, from]);

  // Reset redirect flag when auth state changes
  useEffect(() => {
    if (!isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response?.data?.user) {
        stableNavigate(from);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      if (response?.data?.user) {
        stableNavigate(from);
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        {/* Show redirect message if exists */}
        {message && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <p className="text-blue-200 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="w-full flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {/* Google login failed */}}
              shape="rectangular"
              theme="outline"
              size="large"
              width="320"
              text="continue_with"
              logo_alignment="center"
              useOneTap={false}
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-gray-800 bg-opacity-50">
                OR
              </span>
            </div>
          </div>

          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
