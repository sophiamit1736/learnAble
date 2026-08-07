const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const activityResultRoutes = require("./routes/activityResultRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/api/results", activityResultRoutes);
app.use(express.urlencoded({ extended: true }));

// Make uploaded images accessible
app.use("/uploads", express.static("uploads"));

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
    res.send("Adaptive Learning Platform API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});