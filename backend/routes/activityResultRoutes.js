const express = require("express");

const router = express.Router();

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  saveResult,
  getStudentResults,
  getAdaptiveSummary,
  getAnalytics,
  getAllResults,
} = require("../controllers/activityResultController");

router.post(
  "/",
  verifyToken,
  saveResult
);

router.get(
  "/student/:studentId",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  getStudentResults
);

router.get(
  "/adaptive/:studentId",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  getAdaptiveSummary
);

router.get(
  "/all",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  getAllResults
);

router.get(
  "/analytics",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  getAnalytics
);

module.exports = router;