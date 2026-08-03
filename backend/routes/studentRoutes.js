const express = require("express");

const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const upload=require("../middleware/upload");

router.post(
    "/",
    upload.single("photo"),
    createStudent
);

router.get("/", getStudents);

router.get("/:id", getStudent);

router.put(
    "/:id",
    upload.single("photo"),
    updateStudent
);
router.delete("/:id", deleteStudent);

module.exports = router;