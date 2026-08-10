const mongoose = require("mongoose");

const learningModuleSchema = new mongoose.Schema(
  {
    moduleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "ADL",
        "Academic",
        "Motor",
        "Language",
        "Vocational",
        "Therapeutic",
        "Specialized Care",
      ],
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: Number,
      default: 10,
    },

    ageGroups: {
      type: [String],
      default: [],
    },

    objectives: {
      type: [String],
      default: [],
    },

    steps: {
      type: [String],
      default: [],
    },

    visuals: {
      type: [String],
      default: [],
    },

    audioText: {
      type: [String],
      default: [],
    },

    activities: {
      type: [
        {
          type: {
            type: String,
            default: "instruction",
          },
          question: {
            type: String,
            default: "",
          },
          options: {
            type: [String],
            default: [],
          },
          answer: {
            type: String,
            default: "",
          },
          image: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    adaptations: {
      type: [String],
      default: [],
    },

    /*
     * Child-friendly learning configuration
     */
    activityType: {
      type: String,
      enum: [
        "visual-sequence",
        "matching",
        "choice",
        "drag-sort",
        "movement",
        "communication",
        "vocational-practice",
        "routine",
      ],
      default: "visual-sequence",
    },

    /*
     * Visual content for every step.
     *
     * Example:
     * {
     *   title: "Take the toothbrush",
     *   instruction: "Pick up your toothbrush",
     *   emoji: "🪥",
     *   image: "/uploads/toothbrush.jpg",
     *   audioText: "Pick up your toothbrush",
     *   action: "tap"
     * }
     */
    interactiveSteps: [
      {
        title: String,
        instruction: String,
        emoji: String,
        image: String,
        audio: String,
        audioText: String,
        action: {
          type: String,
          default: "tap",
        },
        choices: [String],
        correctChoice: String,
      },
    ],

    /*
     * Optional module introduction media
     */
    coverImage: {
      type: String,
      default: "",
    },

    coverEmoji: {
      type: String,
      default: "🌱",
    },

    audioEnabled: {
      type: Boolean,
      default: true,
    },

    icon: {
      type: String,
      default: "school",
    },

    color: {
      type: String,
      default: "#1565C0",
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

module.exports = mongoose.model(
  "LearningModule",
  learningModuleSchema
);