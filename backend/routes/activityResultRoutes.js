const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  saveResult,
  getStudentResults,
  getAdaptiveSummary,
} = require("../controllers/activityResultController");

router.post(
  "/",
  verifyToken,
  saveResult
);

router.get(
  "/student/:studentId",
  verifyToken,
  getStudentResults
);

router.get(
  "/adaptive/:studentId",
  verifyToken,
  getAdaptiveSummary
);

module.exports = router;