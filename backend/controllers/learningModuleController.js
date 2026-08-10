const LearningModule = require("../models/LearningModule");

// Get all modules
const getModules = async (req, res) => {
  try {
    const { category, level } = req.query;

    const filter = {
      status: "Active",
    };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (level && level !== "All") {
      filter.level = level;
    }

    const modules = await LearningModule.find(filter).sort({
      createdAt: -1,
    });

    res.json(modules);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch learning modules",
    });
  }
};


// Get single module
const getModule = async (req, res) => {
  try {
    const module = await LearningModule.findOne({
      moduleId: req.params.moduleId,
      status: "Active",
    });

    if (!module) {
      return res.status(404).json({
        message: "Learning module not found",
      });
    }

    res.json(module);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch learning module",
    });
  }
};


// Create module
const createModule = async (req, res) => {
  try {
    const module = await LearningModule.create(req.body);

    res.status(201).json(module);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Update module
const updateModule = async (req, res) => {
  try {
    const module = await LearningModule.findOneAndUpdate(
      {
        moduleId: req.params.moduleId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!module) {
      return res.status(404).json({
        message: "Learning module not found",
      });
    }

    res.json(module);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getModules,
  getModule,
  createModule,
  updateModule,
};