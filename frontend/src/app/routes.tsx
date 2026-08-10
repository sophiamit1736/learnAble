import { createBrowserRouter } from "react-router";

import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import EditStudentPage from "./pages/EditStudentPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import ActivityLibraryPage from "./pages/ActivityLibraryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import AIActivityGeneratorPage from "./pages/AIActivityGeneratorPage";
import ALPIDashboardPage from "./pages/ALPIDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import PictureIdentificationGame from "./games/PictureIdentificationGame";
import DragDropGame from "./games/DragandDropGame";
import MemoryGame from "./games/MemoryGame";
import LearningScreenPage from "./pages/LearningScreenPage";
import LearningModulesPage from "./pages/LearningModulesPage";
import LearningModuleDetailsPage from "./pages/LearningModuleDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/students",
    element: (
      <ProtectedRoute>
        <StudentsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/students/add",
    element: (
      <RoleProtectedRoute roles={["admin"]}>
        <AddStudentPage />
      </RoleProtectedRoute>
    ),
  },

  {
    path: "/students/edit/:id",
    element: (
      <ProtectedRoute>
        <EditStudentPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/students/:id",
    element: (
      <ProtectedRoute>
        <StudentProfilePage />
      </ProtectedRoute>
    ),
  },

  /* =========================
     LEARNING GAMES
     ========================= */

  {
  path: "/learn/:activityId",
  element: (
    <ProtectedRoute>
      <LearningScreenPage />
    </ProtectedRoute>
  ),
},

{
  path: "/learn/:game",
  element: (
    <ProtectedRoute>
      <LearningScreenPage />
    </ProtectedRoute>
  ),
},
  {
    path: "/learn/picture-identification",
    element: (
      <ProtectedRoute>
        <PictureIdentificationGame />
      </ProtectedRoute>
    ),
  },
/** learn/shape-matching */
  {
    path: "/learn/drag-drop",
    element: (
      <ProtectedRoute>
        <DragDropGame />
      </ProtectedRoute>
    ),
  },

  {
    path: "/learn/memory",
    element: (
      <ProtectedRoute>
        <MemoryGame />
      </ProtectedRoute>
    ),
  },

  {
    path: "/activities",
    element: (
      <ProtectedRoute>
        <ActivityLibraryPage />
      </ProtectedRoute>
    ),
  },
  {
  path: "/learning-modules",
  element: (
    <ProtectedRoute>
      <LearningModulesPage />
    </ProtectedRoute>
  ),
},
  {
    path: "/learning-modules/:moduleId",
    element: (
      <ProtectedRoute>
        <LearningModuleDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <ALPIDashboardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/ai-generator",
    element: (
      <ProtectedRoute>
        <AIActivityGeneratorPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <RoleProtectedRoute roles={["admin"]}>
        <AdminDashboardPage />
      </RoleProtectedRoute>
    ),
  },

  // {
  //   path: "*",
  //   element: <SplashPage />,
  // },
]);

export default router;