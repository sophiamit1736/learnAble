const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  saveResult,
  getStudentResults,
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

module.exports = router;