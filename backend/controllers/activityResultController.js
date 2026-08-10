const ActivityResult = require("../models/ActivityResult");
const LearningModule = require("../models/LearningModule");

// Save a completed learning activity and its performance signals.
const saveResult = async (req, res) => {
  try {
    const {
      student,
      activityName,
      moduleId,
      domain,
      level,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      accuracy,
      timeTaken,
      attempts,
      helpRequests,
    } = req.body;

    if (!student || !activityName) {
      return res.status(400).json({
        message: "student and activityName are required.",
      });
    }

    const result = await ActivityResult.create({
      student,
      teacher: req.user.id,
      activityName,
      moduleId,
      domain,
      level,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      accuracy,
      timeTaken,
      attempts,
      helpRequests,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("saveResult error:", err);
    res.status(500).json({ message: err.message });
  }
};

const getStudentResults = async (req, res) => {
  try {
    const results = await ActivityResult.find({
      student: req.params.studentId,
    })
      .sort({ createdAt: -1 })
      .populate("student", "name studentCode");

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Adaptive summary used by the learner/teacher UI.
const getAdaptiveSummary = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const results = await ActivityResult.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    if (!results.length) {
      return res.json({
        alpi: 0,
        totalActivities: 0,
        domainMastery: [],
        latest: null,
        recommendation: {
          type: "baseline",
          title: "Start with a guided learning activity",
          reason: "No performance data is available yet.",
          moduleId: "adl-brushing",
        },
      });
    }

    const overall = results.reduce((sum, r) => sum + Number(r.accuracy || 0), 0) / results.length;

    const domainMap = new Map();
    for (const result of results) {
      const domain = result.domain || "General";
      const current = domainMap.get(domain) || { sum: 0, count: 0 };
      current.sum += Number(result.accuracy || 0);
      current.count += 1;
      domainMap.set(domain, current);
    }

    const domainMastery = Array.from(domainMap.entries()).map(([domain, value]) => ({
      domain,
      mastery: Math.round(value.sum / value.count),
      activities: value.count,
    }));

    const latest = results[0];
    const latestAccuracy = Number(latest.accuracy || 0);

    let recommendation;

    if (latestAccuracy >= 80) {
      const nextModule = await LearningModule.findOne({
        category: latest.domain || "ADL",
        moduleId: { $ne: latest.moduleId || "" },
        status: { $ne: "inactive" },
      }).sort({ level: 1, createdAt: 1 }).lean();

      recommendation = nextModule
        ? {
            type: "advance",
            title: `Ready for: ${nextModule.title}`,
            reason: "The learner demonstrated strong mastery in the completed activity.",
            moduleId: nextModule.moduleId,
          }
        : {
            type: "advance",
            title: "Ready for the next ADL activity",
            reason: "The learner demonstrated strong mastery in the completed activity.",
            moduleId: "",
          };
    } else if (latestAccuracy >= 50) {
      recommendation = {
        type: "practice",
        title: `Practise again: ${latest.activityName}`,
        reason: "The learner is developing mastery. Repeat with visual prompts before increasing difficulty.",
        moduleId: latest.moduleId || "",
      };
    } else {
      recommendation = {
        type: "support",
        title: `Guided practice: ${latest.activityName}`,
        reason: "The learner needs additional support. Use the pictorial steps and repeat the activity with help.",
        moduleId: latest.moduleId || "",
      };
    }

    res.json({
      alpi: Math.round(overall),
      totalActivities: results.length,
      domainMastery,
      latest,
      recommendation,
    });
  } catch (err) {
    console.error("getAdaptiveSummary error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveResult,
  getStudentResults,
  getAdaptiveSummary,
};
