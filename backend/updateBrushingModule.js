require("dotenv").config();
const mongoose = require("mongoose");
const LearningModule = require("./models/LearningModule");

const brushingSteps = [
  {
    title: "Pick up your toothbrush",
    instruction: "Pick up your toothbrush.",
    audioText: "Pick up your toothbrush.",
    image: "/learning/brushing/step1.png",
    action: "tap",
  },
  {
    title: "Put toothpaste on your toothbrush",
    instruction: "Put a small amount of toothpaste on your toothbrush.",
    audioText: "Put a small amount of toothpaste on your toothbrush.",
    image: "/learning/brushing/step2.png",
    action: "tap",
  },
  {
    title: "Brush the front teeth",
    instruction: "Brush the front teeth using gentle up and down movements.",
    audioText: "Brush the front teeth using gentle up and down movements.",
    image: "/learning/brushing/step3.png",
    action: "tap",
  },
  {
    title: "Brush the back teeth",
    instruction: "Brush the back teeth on both sides.",
    audioText: "Brush the back teeth on both sides.",
    image: "/learning/brushing/step4.png",
    action: "tap",
  },
  {
    title: "Rinse your mouth",
    instruction: "Rinse your mouth with clean water.",
    audioText: "Rinse your mouth with clean water.",
    image: "/learning/brushing/step5.png",
    action: "tap",
  },
  {
    title: "Clean and store your toothbrush",
    instruction: "Clean your toothbrush and keep it in its place.",
    audioText: "Clean your toothbrush and keep it in its place.",
    image: "/learning/brushing/step6.png",
    action: "tap",
  },
];

async function update() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const module = await LearningModule.findOneAndUpdate(
      { moduleId: "adl-brushing" },
      {
        $set: {
          steps: brushingSteps.map((step) => step.instruction),
          interactiveSteps: brushingSteps,
          activityType: "visual-sequence",
          audioEnabled: true,
          adaptations: [
            "Use picture instructions",
            "Demonstrate each step",
            "Allow extra practice time",
            "Use audio prompts when needed",
          ],
        },
      },
      { new: true }
    );

    if (!module) {
      throw new Error('Module "adl-brushing" was not found. Run the main seed first.');
    }

    console.log("Updated Brushing Teeth module successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to update Brushing Teeth module:", error);
    process.exit(1);
  }
}

update();
