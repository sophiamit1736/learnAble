const mongoose = require("mongoose");

const activityResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activityName: {
      type: String,
      required: true,
    },

    moduleId: {
      type: String,
      default: "",
      index: true,
    },

    domain: {
      type: String,
      default: "General",
      index: true,
    },

    level: {
      type: String,
      default: "Level 1",
    },

    totalQuestions: {
      type: Number,
      default: 5,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    timeTaken: {
      type: Number,
      default: 0,
    },

    attempts: {
      type: Number,
      default: 1,
    },

    helpRequests: {
      type: Number,
      default: 0,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ActivityResult",
  activityResultSchema
);