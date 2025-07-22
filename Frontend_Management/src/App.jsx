import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/authStore";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import SignUpPage from "./pages/AuthPage/SignUpPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage";

import DashboardPage from "./pages/AuthPage/DashboardPage";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { CurriculumPage } from "./pages/CurriculumPage/CurriculumPage";
import GameLessons from "./pages/GameLessonsPage/GameLessons";
import AllGames from "./pages/allGames/AllGames";
import LessonPage from "./pages/LessonPage/LessonPage";
import { ShapeRace } from "./pages";
import GamePage from "./pages/GamePage/GamePage";
import { ParentDashboard } from "./pages/ParentDashboard/ParentDashboard";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import Lesson1 from "./pages/lesson-detail/vietnamese/Lesson1";
import Lesson2 from "./pages/lesson-detail/vietnamese/Lesson2";
import NumberLessonPage from "./pages/lesson-detail/numbers/Lesson1";
import NumberReadingLessonPage from "./pages/lesson-detail/numbers/Lesson2";
import AnimalLessonPage from "./pages/lesson-detail/animal/lesson1";
import LessonAccessDemo from "./components/sharedComponents/LessonAccessDemo";

// Import Payment Components
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentCancel from "./components/payment/PaymentCancel";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  // Check authentication when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/game-lessons" element={<GameLessons />} />
          <Route path="/game-lessons/games/:id" element={<AllGames />} />
          <Route path="/all-games/:id" element={<AllGames />} />
          <Route
            path="/game-lessons/game-lesson/:id"
            element={<LessonPage />}
          />
          <Route
            path="/game-lessons/games/shapes/:id"
            element={<ShapeRace />}
          />
          <Route
            path="/game-lessons/games/counting/:id"
            element={<GamePage />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Vietnamese Lessons */}
          <Route
            path="/lesson-detail/vietnamese/lesson1"
            element={<Lesson1 />}
          />
          <Route
            path="/lesson-detail/vietnamese/lesson2"
            element={<Lesson2 />}
          />

          {/* Math Lessons */}
          <Route
            path="/lesson-detail/math/lesson4"
            element={<NumberLessonPage />}
          />
          <Route
            path="/lesson-detail/math/lesson5"
            element={<NumberReadingLessonPage />}
          />

          {/* Legacy number routes */}
          <Route
            path="/lesson-detail/numbers/lesson4"
            element={<NumberLessonPage />}
          />
          <Route
            path="/lesson-detail/numbers/lesson5"
            element={<NumberReadingLessonPage />}
          />

          {/* Animal Lessons */}
          <Route
            path="/lesson-detail/animal/lesson1"
            element={<AnimalLessonPage />}
          />
          <Route
            path="/lesson-detail/animal/lesson3"
            element={<AnimalLessonPage />}
          />

          {/* Payment Demo */}
          <Route
            path="/payment-demo"
            element={<LessonAccessDemo />}
          />

          {/* Payment Result Pages */}
          <Route
            path="/payment/success"
            element={<PaymentSuccess />}
          />
          <Route
            path="/payment/cancel"
            element={<PaymentCancel />}
          />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;