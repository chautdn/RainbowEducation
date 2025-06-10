import { Route, Routes } from "react-router-dom";

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
import Lesson1 from './pages/lesson-detail/vietnamese/Lesson1';
import Lesson2 from './pages/lesson-detail/vietnamese/Lesson2';
import Number1 from './pages/lesson-detail/numbers/Lesson1';

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/game-lessons" element={<GameLessons />} />
        <Route path="/game-lessons/games/:id" element={<AllGames />} />
        <Route path="/all-games/:id" element={<AllGames />} />
        <Route path="/game-lessons/game-lesson/:id" element={<LessonPage />} />
        <Route path="/game-lessons/games/shapes/:id" element={<ShapeRace />} />
        <Route path="/game-lessons/games/counting/:id" element={<GamePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/lesson-detail/vietnamese/lesson1" element={<Lesson1 />} />
        <Route path="/lesson-detail/vietnamese/lesson2" element={<Lesson2 />} />
        <Route path="/lesson-detail/numbers/lesson3" element={<Number1 />} />
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
