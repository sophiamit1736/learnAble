const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const count = await Student.countDocuments();

    const studentCode = `STU-${String(count + 1).padStart(4, "0")}`;

    // Calculate age from DOB
    let age = 0;

    if (req.body.dateOfBirth) {
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

      facpScore: req.body.facpBaseline || 0,

      guardianName: req.body.guardianName,

      guardianPhone: req.body.guardianPhone,

      address: req.body.address,

      photo: req.file ? `/uploads/${req.file.filename}` : "",

      status: "Active",
    });

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student)
      return res.status(404).json({
        message: "Student not found",
      });

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    let age;

    if (req.body.dateOfBirth) {
      const dob = new Date(req.body.dateOfBirth);
      age = new Date().getFullYear() - dob.getFullYear();
    }

    const updateData = {
      name: req.body.fullName,
      age,
      gender: req.body.gender,
      disabilityLevel: req.body.disabilityLevel,
      learningLevel: req.body.learningLevel,
      facpScore: req.body.facpBaseline,
      guardianName: req.body.guardianName,
      guardianPhone: req.body.guardianPhone,
      address: req.body.address,
    };

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
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