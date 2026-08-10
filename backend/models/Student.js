const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    disabilityLevel: {
      type: String,
      enum: ["Mild", "Moderate", "Severe", "Profound"],
      required: true,
    },

    learningLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      required: true,
    },

    facpScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Adaptive Learning Performance Index (0-100).
    // Updated automatically from completed ActivityResult records.
    alpiScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    guardianName: {
      type: String,
      required: true,
      trim: true,
    },

    guardianPhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    photo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);