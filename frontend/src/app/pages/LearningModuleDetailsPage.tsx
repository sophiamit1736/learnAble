import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, TopBar } from "./DashboardPage";
import { getLearningModule } from "../api/learningModuleApi";
import type { LearningModule } from "../types/learningModule";

const P = "Poppins, sans-serif";

const visualMap: Record<string, {
  emoji: string;
  background: string;
  accent: string;
  instruction: string;
}> = {
  "adl-brushing": {
    emoji: "🪥",
    background: "#E3F2FD",
    accent: "#1565C0",
    instruction: "Let's brush our teeth!",
  },

  "adl-combing": {
    emoji: "💇",
    background: "#F3E5F5",
    accent: "#8E44AD",
    instruction: "Let's comb our hair!",
  },

  "adl-dressing": {
    emoji: "👕",
    background: "#EDE7F6",
    accent: "#7E57C2",
    instruction: "Let's get dressed!",
  },

  "adl-buttoning": {
    emoji: "🔘",
    background: "#EDE7F6",
    accent: "#5E35B1",
    instruction: "Let's practise buttoning!",
  },

  "adl-toilet": {
    emoji: "🚽",
    background: "#E0F2F1",
    accent: "#00897B",
    instruction: "Let's follow the toilet routine!",
  },

  "adl-drinking": {
    emoji: "🥤",
    background: "#E1F5FE",
    accent: "#0288D1",
    instruction: "Let's practise drinking!",
  },

  "adl-eating": {
    emoji: "🍽️",
    background: "#FBE9E7",
    accent: "#FF7043",
    instruction: "Let's practise eating!",
  },

  "adl-grooming": {
    emoji: "🧼",
    background: "#E0F2F1",
    accent: "#26A69A",
    instruction: "Let's practise grooming!",
  },

  "academic-colours": {
    emoji: "🎨",
    background: "#FCE4EC",
    accent: "#E91E63",
    instruction: "Let's learn colours!",
  },

  "academic-numbers": {
    emoji: "🔢",
    background: "#E0F2F1",
    accent: "#26A69A",
    instruction: "Let's learn numbers!",
  },

  "academic-shapes": {
    emoji: "🔺",
    background: "#E3F2FD",
    accent: "#1565C0",
    instruction: "Let's learn shapes!",
  },

  "academic-time": {
    emoji: "⏰",
    background: "#E8EAF6",
    accent: "#3949AB",
    instruction: "Let's learn about time!",
  },

  "academic-money": {
    emoji: "💰",
    background: "#E8F5E9",
    accent: "#43A047",
    instruction: "Let's learn about money!",
  },

  "academic-reading": {
    emoji: "📖",
    background: "#FFF3E0",
    accent: "#EF6C00",
    instruction: "Let's practise reading!",
  },

  "academic-alphabet": {
    emoji: "🔤",
    background: "#F3E5F5",
    accent: "#AB47BC",
    instruction: "Let's learn letters!",
  },

  "academic-prewriting": {
    emoji: "✏️",
    background: "#FFF8E1",
    accent: "#FFA000",
    instruction: "Let's practise writing!",
  },

  "motor-fine": {
    emoji: "🤲",
    background: "#E8EAF6",
    accent: "#5C6BC0",
    instruction: "Let's practise our hands!",
  },

  "motor-coordination": {
    emoji: "👀",
    background: "#E0F7FA",
    accent: "#00ACC1",
    instruction: "Let's practise coordination!",
  },

  "motor-gross": {
    emoji: "🏃",
    background: "#E8F5E9",
    accent: "#43A047",
    instruction: "Let's move our body!",
  },

  "motor-physical": {
    emoji: "🤸",
    background: "#F1F8E9",
    accent: "#7CB342",
    instruction: "Let's exercise!",
  },

  "motor-outdoor": {
    emoji: "⚽",
    background: "#E8F5E9",
    accent: "#388E3C",
    instruction: "Let's play!",
  },

  "language-vocabulary": {
    emoji: "🗣️",
    background: "#FFF3E0",
    accent: "#FB8C00",
    instruction: "Let's learn new words!",
  },

  "language-receptive": {
    emoji: "👂",
    background: "#E3F2FD",
    accent: "#1976D2",
    instruction: "Listen carefully!",
  },

  "language-expressive": {
    emoji: "💬",
    background: "#F3E5F5",
    accent: "#8E24AA",
    instruction: "Let's communicate!",
  },

  "language-story": {
    emoji: "📚",
    background: "#FFF8E1",
    accent: "#F9A825",
    instruction: "Let's tell a story!",
  },

  "language-rhymes": {
    emoji: "🎵",
    background: "#FCE4EC",
    accent: "#D81B60",
    instruction: "Let's sing!",
  },

  "language-lip-tongue": {
    emoji: "👄",
    background: "#FBE9E7",
    accent: "#E64A19",
    instruction: "Let's practise!",
  },

  "language-sign": {
    emoji: "🤟",
    background: "#E8EAF6",
    accent: "#3949AB",
    instruction: "Let's communicate with signs!",
  },

  "vocational-tools": {
    emoji: "🔧",
    background: "#EFEBE9",
    accent: "#6D4C41",
    instruction: "Let's identify tools!",
  },

  "vocational-machines": {
    emoji: "⚙️",
    background: "#ECEFF1",
    accent: "#455A64",
    instruction: "Let's identify machines!",
  },

  "vocational-leather-tracing": {
    emoji: "📐",
    background: "#EFEBE9",
    accent: "#795548",
    instruction: "Let's practise tracing!",
  },

  "vocational-stitching": {
    emoji: "🧵",
    background: "#FCE4EC",
    accent: "#AD1457",
    instruction: "Let's practise stitching!",
  },

  "vocational-leather-cutting": {
    emoji: "✂️",
    background: "#EFEBE9",
    accent: "#6D4C41",
    instruction: "Let's practise cutting!",
  },

  "vocational-leather-pasting": {
    emoji: "🧴",
    background: "#FFF3E0",
    accent: "#EF6C00",
    instruction: "Let's practise pasting!",
  },

  "vocational-leather-punching": {
    emoji: "🔨",
    background: "#EFEBE9",
    accent: "#6D4C41",
    instruction: "Let's practise punching!",
  },

  "therapeutic-yoga": {
    emoji: "🧘",
    background: "#E8F5E9",
    accent: "#43A047",
    instruction: "Let's relax and move!",
  },

  "therapeutic-music": {
    emoji: "🎵",
    background: "#FFF3E0",
    accent: "#EF6C00",
    instruction: "Let's make music!",
  },

  "therapeutic-play": {
    emoji: "🧸",
    background: "#FBE9E7",
    accent: "#FF7043",
    instruction: "Let's play together!",
  },

  "therapeutic-gardening": {
    emoji: "🌱",
    background: "#F1F8E9",
    accent: "#558B2F",
    instruction: "Let's grow something!",
  },

  "therapeutic-computer": {
    emoji: "💻",
    background: "#E3F2FD",
    accent: "#1976D2",
    instruction: "Let's learn with technology!",
  },

  "therapeutic-social": {
    emoji: "🤝",
    background: "#E0F2F1",
    accent: "#00897B",
    instruction: "Let's interact!",
  },

  "specialized-adl": {
    emoji: "🌟",
    background: "#ECEFF1",
    accent: "#455A64",
    instruction: "Let's practise together!",
  },

  "specialized-intensive": {
    emoji: "🫶",
    background: "#ECEFF1",
    accent: "#546E7A",
    instruction: "We can do this together!",
  },

  "specialized-assessment": {
    emoji: "📋",
    background: "#ECEFF1",
    accent: "#37474F",
    instruction: "Let's learn step by step!",
  },
};

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

function Visual({
  module,
  step,
}: {
  module: LearningModule;
  step: number;
}) {
  const visual = visualMap[module.moduleId] || {
    emoji: "🌟",
    background: "#E3F2FD",
    accent: module.color,
    instruction: "Let's learn!",
  };

  return (
    <motion.div
      key={step}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: [0, -6, 0],
      }}
      transition={{
        duration: 0.7,
        y: {
          duration: 2.2,
          repeat: Infinity,
        },
      }}
      className="mx-auto rounded-[32px] flex items-center justify-center relative overflow-hidden"
      style={{
        width: "min(100%, 360px)",
        height: 250,
        background: visual.background,
        border: `4px solid ${visual.accent}20`,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 170,
          height: 170,
          background: `${visual.accent}12`,
        }}
      />

      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
        style={{
          fontSize: 105,
          position: "relative",
          zIndex: 2,
          userSelect: "none",
        }}
      >
        {visual.emoji}
      </motion.div>

      <div
        className="absolute bottom-3 left-3 right-3 rounded-2xl px-4 py-2"
        style={{
          background: "rgba(255,255,255,.88)",
          fontFamily: P,
          fontWeight: 600,
          fontSize: 13,
          color: visual.accent,
        }}
      >
        {visual.instruction}
      </div>
    </motion.div>
  );
}

function ChoiceActivity({
  module,
  step,
  onCorrect,
}: {
  module: LearningModule;
  step: number;
  onCorrect: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const choices = useMemo(() => {
    const current = module.steps[step];

    return [
      {
        id: "yes",
        text: "I can do it!",
        emoji: "👍",
      },
      {
        id: "help",
        text: "I need help",
        emoji: "🫶",
      },
      {
        id: "again",
        text: "Show again",
        emoji: "🔁",
      },
    ];
  }, [module, step]);

  const choose = (id: string) => {
    setSelected(id);

    speak(
      id === "yes"
        ? "Great job!"
        : id === "help"
        ? "That's okay. We can help you."
        : "Let's look at the step again."
    );

    if (id === "yes") {
      window.setTimeout(onCorrect, 500);
    }
  };

  return (
    <div className="mt-6">
      <p
        className="text-center mb-4"
        style={{
          fontFamily: P,
          fontSize: 13,
          color: "#607D8B",
        }}
      >
        What would you like to do?
      </p>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
        }}
      >
        {choices.map((choice) => (
          <motion.button
            key={choice.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(choice.id)}
            className="rounded-2xl p-4 border-0"
            style={{
              background:
                selected === choice.id
                  ? `${module.color}18`
                  : "#F7FAFD",
              border:
                selected === choice.id
                  ? `2px solid ${module.color}`
                  : "2px solid transparent",
              cursor: "pointer",
              fontFamily: P,
            }}
          >
            <div style={{ fontSize: 34 }}>{choice.emoji}</div>

            <div
              className="mt-2"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#263238",
              }}
            >
              {choice.text}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Confetti() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 20 }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: `${(i * 37) % 100}%`,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: "110vh",
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + (i % 4) * 0.3,
            delay: (i % 5) * 0.08,
          }}
          style={{
            position: "absolute",
            width: 10,
            height: 16,
            borderRadius: 4,
            background: [
              "#1565C0",
              "#27AE60",
              "#FF7043",
              "#AB47BC",
              "#FFA726",
            ][i % 5],
          }}
        />
      ))}
    </div>
  );
}

export default function LearningModuleDetailsPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    if (!moduleId) return;

    let mounted = true;

    setLoading(true);

    getLearningModule(moduleId)
      .then((res) => {
        if (mounted) {
          setModule(res.data);
        }
      })
      .catch((err) => {
        console.error(err);

        if (mounted) {
          setError("Unable to load this learning module.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [moduleId]);

  useEffect(() => {
    if (!started || completed) return;

    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, completed]);

  useEffect(() => {
    if (!module || !started || !soundOn || completed) return;

    speak(module.steps[step]);
  }, [module, step, started, soundOn, completed]);

  const progress = module
    ? Math.round(((step + (completed ? 1 : 0)) / module.steps.length) * 100)
    : 0;

  const time = `${String(Math.floor(seconds / 60)).padStart(
    2,
    "0"
  )}:${String(seconds % 60).padStart(2, "0")}`;

  const startActivity = () => {
    setStarted(true);
    setCompleted(false);
    setStep(0);
    setSeconds(0);

    if (module && soundOn) {
      speak(module.steps[0]);
    }
  };

  const nextStep = () => {
    if (!module) return;

    if (step >= module.steps.length - 1) {
      setCompleted(true);
      speak("Amazing! You completed the activity!");
      return;
    }

    setStep((value) => value + 1);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "#F0F6FF",
          fontFamily: P,
        }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              fontSize: 42,
            }}
          >
            🌱
          </motion.div>

          <p
            className="mt-3"
            style={{
              color: "#607D8B",
              fontSize: 13,
            }}
          >
            Preparing your learning activity...
          </p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: "#F0F6FF",
          fontFamily: P,
        }}
      >
        <div style={{ fontSize: 60 }}>😕</div>

        <p
          className="mt-4"
          style={{
            color: "#546E7A",
          }}
        >
          {error || "Module not found"}
        </p>

        <button
          onClick={() => navigate("/learning-modules")}
          className="mt-5 px-5 py-3 rounded-xl border-0 text-white"
          style={{
            background: "#1565C0",
            fontFamily: P,
            cursor: "pointer",
          }}
        >
          Back to Modules
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "#F0F6FF",
      }}
    >
      <Sidebar active="Activities" />

      <div className="flex-1 min-w-0">
        <TopBar
          title="Learning Module"
          subtitle="Learn • Practise • Grow"
        />

        <main className="p-6 md:p-8 max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/learning-modules")}
            className="flex items-center gap-1 mb-5 bg-transparent border-0"
            style={{
              color: "#1565C0",
              fontFamily: P,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <span className="material-icons-round">
              arrow_back
            </span>

            Back to Learning Modules
          </button>

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[30px] p-6 md:p-8 mb-6"
            style={{
              background: `linear-gradient(135deg, ${module.color}, #1565C0)`,
              color: "#fff",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,.18)",
                    fontFamily: P,
                    fontSize: 11,
                  }}
                >
                  {module.category}
                </span>

                <h1
                  className="mt-3"
                  style={{
                    fontFamily: P,
                    fontSize: 25,
                    fontWeight: 800,
                  }}
                >
                  {module.title}
                </h1>

                <p
                  className="mt-2"
                  style={{
                    fontFamily: P,
                    fontSize: 13,
                    opacity: 0.9,
                    maxWidth: 650,
                  }}
                >
                  {module.description}
                </p>
              </div>

              <div
                style={{
                  fontSize: 65,
                }}
              >
                {visualMap[module.moduleId]?.emoji || "🌟"}
              </div>
            </div>
          </motion.div>

          {!started ? (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(280px,1fr))",
              }}
            >
              {/* VISUAL INTRO */}
              <div
                className="rounded-[30px] p-6"
                style={{
                  background: "#fff",
                  boxShadow:
                    "0 5px 25px rgba(21,101,192,.08)",
                }}
              >
                <Visual module={module} step={0} />

                <button
                  onClick={() =>
                    speak(
                      `${module.title}. ${module.description}`
                    )
                  }
                  className="w-full mt-5 py-3 rounded-xl border-0"
                  style={{
                    background: "#F0F6FF",
                    color: "#1565C0",
                    fontFamily: P,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  🔊 Listen
                </button>
              </div>

              {/* GOALS */}
              <div
                className="rounded-[30px] p-6"
                style={{
                  background: "#fff",
                  boxShadow:
                    "0 5px 25px rgba(21,101,192,.08)",
                }}
              >
                <h2
                  style={{
                    fontFamily: P,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0D2137",
                  }}
                >
                  🎯 Today's Goals
                </h2>

                <div className="mt-5 space-y-3">
                  {module.objectives.map((objective, index) => (
                    <div
                      key={objective}
                      className="flex gap-3 items-start"
                    >
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          background: `${module.color}18`,
                          color: module.color,
                          fontFamily: P,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {index + 1}
                      </div>

                      <p
                        style={{
                          fontFamily: P,
                          fontSize: 13,
                          color: "#546E7A",
                          lineHeight: 1.5,
                        }}
                      >
                        {objective}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startActivity}
                  className="w-full mt-7 py-4 rounded-2xl border-0 text-white"
                  style={{
                    background: module.color,
                    fontFamily: P,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 8px 20px ${module.color}44`,
                  }}
                >
                  ▶ Start Learning
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {completed && <Confetti />}

              {/* TOP CONTROLS */}
              <div
                className="rounded-3xl p-5 mb-5"
                style={{
                  background: "#fff",
                  boxShadow:
                    "0 4px 20px rgba(21,101,192,.07)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div
                      style={{
                        fontFamily: P,
                        fontSize: 12,
                        color: "#78909C",
                      }}
                    >
                      STEP {Math.min(step + 1, module.steps.length)}{" "}
                      OF {module.steps.length}
                    </div>

                    <div
                      className="mt-1"
                      style={{
                        fontFamily: P,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0D2137",
                      }}
                    >
                      {completed
                        ? "Activity Complete!"
                        : "Keep going! 🌟"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSoundOn((value) => !value);

                        if (!soundOn && module) {
                          speak(module.steps[step]);
                        }
                      }}
                      className="flex items-center justify-center rounded-xl border-0"
                      style={{
                        width: 44,
                        height: 44,
                        background: "#F0F6FF",
                        cursor: "pointer",
                        color: "#1565C0",
                      }}
                    >
                      <span className="material-icons-round">
                        {soundOn
                          ? "volume_up"
                          : "volume_off"}
                      </span>
                    </button>

                    <div
                      className="px-3 py-2 rounded-xl"
                      style={{
                        background: "#F7FAFD",
                        color: "#546E7A",
                        fontFamily: P,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      ⏱ {time}
                    </div>
                  </div>
                </div>

                <div
                  className="h-3 rounded-full mt-5 overflow-hidden"
                  style={{
                    background: "#E6EEF6",
                  }}
                >
                  <motion.div
                    animate={{
                      width: `${completed ? 100 : Math.max(progress, 5)}%`,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${module.color}, #27AE60)`,
                    }}
                  />
                </div>
              </div>

              {!completed ? (
                <motion.div
                  key={step}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-[32px] p-6 md:p-8"
                  style={{
                    background: "#fff",
                    boxShadow:
                      "0 8px 35px rgba(21,101,192,.09)",
                  }}
                >
                  <Visual module={module} step={step} />

                  <div className="text-center mt-6">
                    <div
                      className="inline-block px-4 py-2 rounded-full"
                      style={{
                        background: `${module.color}12`,
                        color: module.color,
                        fontFamily: P,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      Step {step + 1}
                    </div>

                    <h2
                      className="mt-4"
                      style={{
                        fontFamily: P,
                        fontSize: 24,
                        fontWeight: 800,
                        color: "#0D2137",
                      }}
                    >
                      {module.steps[step]}
                    </h2>

                    <p
                      className="mt-3"
                      style={{
                        fontFamily: P,
                        fontSize: 13,
                        color: "#607D8B",
                      }}
                    >
                      Take your time. You can listen again
                      or ask for help.
                    </p>

                    <button
                      onClick={() =>
                        speak(module.steps[step])
                      }
                      className="mt-4 px-5 py-2 rounded-xl border-0"
                      style={{
                        background: "#F0F6FF",
                        color: "#1565C0",
                        fontFamily: P,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      🔊 Hear the instruction
                    </button>

                    <ChoiceActivity
                      module={module}
                      step={step}
                      onCorrect={nextStep}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="rounded-[32px] p-10 text-center"
                  style={{
                    background: "#fff",
                    boxShadow:
                      "0 10px 40px rgba(21,101,192,.1)",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    style={{
                      fontSize: 85,
                    }}
                  >
                    🏆
                  </motion.div>

                  <h2
                    className="mt-5"
                    style={{
                      fontFamily: P,
                      fontSize: 28,
                      fontWeight: 800,
                      color: "#0D2137",
                    }}
                  >
                    Amazing Work! 🎉
                  </h2>

                  <p
                    className="mt-3"
                    style={{
                      fontFamily: P,
                      color: "#607D8B",
                      fontSize: 14,
                    }}
                  >
                    You completed{" "}
                    <strong>{module.title}</strong>!
                  </p>

                  <div
                    className="flex justify-center gap-2 mt-5"
                    style={{ fontSize: 30 }}
                  >
                    ⭐ ⭐ ⭐
                  </div>

                  <div
                    className="mt-5 mx-auto rounded-2xl p-4"
                    style={{
                      background: "#F0F6FF",
                      maxWidth: 300,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: P,
                        fontSize: 12,
                        color: "#78909C",
                      }}
                    >
                      Practice time
                    </div>

                    <strong
                      style={{
                        fontFamily: P,
                        fontSize: 22,
                        color: "#1565C0",
                      }}
                    >
                      {time}
                    </strong>
                  </div>

                  <div className="flex justify-center gap-3 mt-7">
                    <button
                      onClick={startActivity}
                      className="px-5 py-3 rounded-xl border-0"
                      style={{
                        background: "#F0F6FF",
                        color: "#1565C0",
                        fontFamily: P,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      🔁 Practise Again
                    </button>

                    <button
                      onClick={() =>
                        navigate("/learning-modules")
                      }
                      className="px-5 py-3 rounded-xl border-0 text-white"
                      style={{
                        background: module.color,
                        fontFamily: P,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Back to Modules
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}