import { createBrowserRouter } from "react-router";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import ActivityLibraryPage from "./pages/ActivityLibraryPage";
import LearningScreenPage from "./pages/LearningScreenPage";
import TeacherObservationPage from "./pages/TeacherObservationPage";
import ALPIDashboardPage from "./pages/ALPIDashboardPage";
import ReportsPage from "./pages/ReportsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AIActivityGeneratorPage from "./pages/AIActivityGeneratorPage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────
  { path: "/",                   Component: SplashPage },
  { path: "/login",              Component: LoginPage },
  { path: "/register",           Component: RegisterPage },

  // ── Teacher portal ──────────────────────────────────────────
  { path: "/dashboard",          Component: DashboardPage },
  { path: "/students",           Component: StudentsPage },
  { path: "/students/add",       Component: AddStudentPage },
  { path: "/students/:id",       Component: StudentProfilePage },
  { path: "/observation/:studentId", Component: TeacherObservationPage },

  // ── Activities & learning ────────────────────────────────────
  { path: "/activities",         Component: ActivityLibraryPage },
  { path: "/learn/:activityId",  Component: LearningScreenPage },

  // ── Analytics & reporting ────────────────────────────────────
  { path: "/analytics",          Component: ALPIDashboardPage },
  { path: "/reports",            Component: ReportsPage },

  // ── Admin & tools ────────────────────────────────────────────
  { path: "/admin",              Component: AdminDashboardPage },
  { path: "/ai-generator",       Component: AIActivityGeneratorPage },
  { path: "/settings",           Component: SettingsPage },
]);
