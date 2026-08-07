const ActivityResult = require("../models/ActivityResult");

// Save Result
const saveResult = async (req, res) => {
  try {
    const {
      student,
      activityName,
      level,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      accuracy,
      timeTaken,
    } = req.body;

    const result = await ActivityResult.create({
      student,
      teacher: req.user.id,
      activityName,
      level,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      accuracy,
      timeTaken,
    });

    res.status(201).json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
};

// Student Results

const getStudentResults = async (req, res) => {

  try {

    const results = await ActivityResult.find({
      student: req.params.studentId,
    }).sort({
      createdAt: -1,
    });

    res.json(results);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

module.exports = {
  saveResult,
  getStudentResults,
};