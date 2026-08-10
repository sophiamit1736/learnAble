const ActivityResult = require("../models/ActivityResult");
const LearningModule = require("../models/LearningModule");
const Student = require("../models/Student");

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

    // ALPI for the current prototype is a transparent 0-100 mastery index:
    // average accuracy across all completed activities for this learner.
    const learnerResults = await ActivityResult.find({ student }).select("accuracy").lean();
    const alpi = learnerResults.length
      ? Math.round(
          learnerResults.reduce((sum, item) => sum + Number(item.accuracy || 0), 0) /
            learnerResults.length
        )
      : 0;

    await Student.findByIdAndUpdate(student, { alpiScore: alpi });

    res.status(201).json({
      result,
      alpi,
      calculation: {
        formula: "ALPI = average accuracy of all completed learning activities",
        activitiesIncluded: learnerResults.length,
      },
    });
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

    const alpi = Math.round(overall);
    await Student.findByIdAndUpdate(studentId, { alpiScore: alpi });

    res.json({
      alpi,
      totalActivities: results.length,
      calculation: {
        formula: "ALPI = average accuracy of all completed learning activities",
        activitiesIncluded: results.length,
      },
      domainMastery,
      latest,
      recommendation,
    });
  } catch (err) {
    console.error("getAdaptiveSummary error:", err);
    res.status(500).json({ message: err.message });
  }
};


const getAllResults = async (req, res) => {
  try {
    const results = await ActivityResult.find({}).sort({ createdAt: -1 }).limit(500).populate("student", "name studentCode").lean();
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAnalytics = async (req, res) => {
  try {
    const results = await ActivityResult.find({}).sort({ createdAt: 1 }).populate("student", "name studentCode age learningLevel").lean();
    const students = await Student.find({ status: "Active" }).select("name studentCode age learningLevel alpiScore").sort({ name: 1 }).lean();
    const totalActivities = results.length;
    const avgAccuracy = totalActivities ? Math.round(results.reduce((s, r) => s + Number(r.accuracy || 0), 0) / totalActivities) : 0;
    const completedStudents = new Map();
    results.forEach(r => { const id = String(r.student?._id || r.student || ""); if (!completedStudents.has(id)) completedStudents.set(id, []); completedStudents.get(id).push(r); });
    const studentProgress = students.map(st => ({
      id: st._id, name: st.name, studentCode: st.studentCode, age: st.age, learningLevel: st.learningLevel,
      alpi: Number(st.alpiScore || 0), activities: (completedStudents.get(String(st._id)) || []).length,
      accuracy: (() => { const a=completedStudents.get(String(st._id))||[]; return a.length ? Math.round(a.reduce((x,r)=>x+Number(r.accuracy||0),0)/a.length) : 0; })()
    }));
    const domainMap = {};
    results.forEach(r => { const d=r.domain||"General"; domainMap[d] ||= {sum:0,count:0}; domainMap[d].sum += Number(r.accuracy||0); domainMap[d].count++; });
    const domainMastery = Object.entries(domainMap).map(([domain,v]) => ({ domain, mastery: Math.round(v.sum/v.count), activities:v.count }));
    const activityDistribution = {};
    results.forEach(r => { const k=r.activityName||"Unknown"; activityDistribution[k]=(activityDistribution[k]||0)+1; });
    const timelineMap = {};
    results.forEach(r => { const d=new Date(r.completedAt||r.createdAt); const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; timelineMap[key] ||= []; timelineMap[key].push(Number(r.accuracy||0)); });
    const timeline = Object.entries(timelineMap).map(([month, vals])=>({ month, accuracy: Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) }));
    res.json({ totalStudents: students.length, totalActivities, avgAccuracy, studentProgress, domainMastery, activityDistribution: Object.entries(activityDistribution).map(([name,value])=>({name,value})), timeline });
  } catch (err) { console.error("getAnalytics error:", err); res.status(500).json({message: err.message}); }
};

module.exports = {
  saveResult,
  getStudentResults,
  getAdaptiveSummary,
  getAnalytics,
  getAllResults,
};
