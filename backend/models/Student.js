const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    studentCode: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },

    disabilityLevel: {
        type: String,
        enum: ["Mild", "Moderate", "Severe", "Profound"],
        required: true
    },

    learningLevel: {
        type: String,
        enum: [
            "Pre-Academic",
            "Basic",
            "Intermediate",
            "Advanced"
        ],
        required: true
    },

    facpScore: {
        type: Number,
        default: 0
    },

    guardianName: {
        type: String,
        required: true
    },

    guardianPhone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        default: ""
    },

    photo: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "Active"
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Student", studentSchema);