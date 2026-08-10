const Student = require("../models/Student");

// ==========================
// CREATE STUDENT
// ==========================
const createStudent = async (req, res) => {
  try {
    // Find the highest existing student code
    const students = await Student.find({}, { studentCode: 1 });

    let maxNumber = 0;

    students.forEach((student) => {
      if (student.studentCode) {
        const num = parseInt(
          student.studentCode.replace("STU-", ""),
          10
        );

        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const studentCode = `STU-${String(maxNumber + 1).padStart(4, "0")}`;

    // Calculate age
    let age = Number(req.body.age);

    if (!Number.isFinite(age) || age < 1) {
      age = 0;
    }

    if (!age && req.body.dateOfBirth) {
      const dob = new Date(req.body.dateOfBirth);

      age = new Date().getFullYear() - dob.getFullYear();
    }

    const student = new Student({
      studentCode,

      name: req.body.fullName,

      age,

      gender: req.body.gender,

      disabilityLevel: req.body.disabilityLevel,

      learningLevel: req.body.learningLevel,

      facpScore: Number(req.body.facpBaseline || 0),

      guardianName: req.body.guardianName,

      guardianPhone: req.body.guardianPhone,

      address: req.body.address,

      photo: req.file ? `/uploads/${req.file.filename}` : "",

      status: "Active",
    });

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// GET ALL STUDENTS
// ==========================
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// GET SINGLE STUDENT
// ==========================
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// UPDATE STUDENT
// ==========================
const updateStudent = async (req, res) => {
  try {
    let age = Number(req.body.age);

    if (!Number.isFinite(age) || age < 1) {
      age = 0;
    }

    if (!age && req.body.dateOfBirth) {
      const dob = new Date(req.body.dateOfBirth);

      age = new Date().getFullYear() - dob.getFullYear();
    }

    const updateData = {
      name: req.body.fullName,
      age,
      gender: req.body.gender,
      disabilityLevel: req.body.disabilityLevel,
      learningLevel: req.body.learningLevel,
      facpScore: Number(req.body.facpBaseline || 0),
      guardianName: req.body.guardianName,
      guardianPhone: req.body.guardianPhone,
      address: req.body.address,
    };

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// DELETE STUDENT
// ==========================
const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};