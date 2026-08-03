import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, TopBar } from "./DashboardPage";

const P = "Poppins, sans-serif";
const primary = "#1565C0";
const accent = "#27ae60";
const muted = "#4A6580";
const dark = "#0D2137";

/* ─── Difficulty pill toggle ─── */
function DifficultyToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = ["Easy", "Medium", "Hard"];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            fontFamily: P,
            fontSize: 13,
            fontWeight: 600,
            padding: "7px 20px",
            borderRadius: 20,
            border: `2px solid ${value === o ? primary : "#e2e8f0"}`,
            background: value === o ? primary : "#fff",
            color: value === o ? "#fff" : muted,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ─── Activity type checkbox chips ─── */
function ActivityChips({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const types = ["Flashcards", "Quiz", "Story", "Matching Game"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {types.map((t) => {
        const on = selected.includes(t);
        return (
          <button
            key={t}
            onClick={() => onToggle(t)}
            style={{
              fontFamily: P,
              fontSize: 12,
              fontWeight: 600,
              padding: "7px 16px",
              borderRadius: 20,
              border: `2px solid ${on ? primary : "#e2e8f0"}`,
              background: on ? primary + "12" : "#fff",
              color: on ? primary : muted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
          >
            {on && <span className="material-icons-round" style={{ fontSize: 14, color: primary }}>check</span>}
            {t}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Flashcard ─── */
function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{
        width: "100%",
        minHeight: 72,
        background: flipped ? primary : "#fff",
        border: `2px solid ${primary}22`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "background 0.25s, color 0.25s",
      }}
    >
      <span className="material-icons-round" style={{ fontSize: 22, color: flipped ? "#fff" : primary }}>
        {flipped ? "lightbulb" : "help_outline"}
      </span>
      <div>
        <div style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: flipped ? "rgba(255,255,255,0.7)" : muted, marginBottom: 2 }}>
          {flipped ? "Answer" : "Question"}
        </div>
        <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: flipped ? "#fff" : dark }}>
          {flipped ? back : front}
        </div>
      </div>
      <span style={{ marginLeft: "auto", fontFamily: P, fontSize: 11, color: flipped ? "rgba(255,255,255,0.5)" : muted }}>
        {flipped ? "← Back" : "Tap to flip →"}
      </span>
    </div>
  );
}

/* ─── Mini Quiz ─── */
function MiniQuiz({ topic }: { topic: string }) {
  const questions = [
    {
      q: `What colour is the sky?`,
      opts: ["Blue", "Green", "Red", "Yellow"],
      ans: 0,
    },
    {
      q: `How many legs does a cat have?`,
      opts: ["2", "4", "6", "8"],
      ans: 1,
    },
    {
      q: `Which is the largest animal?`,
      opts: ["Dog", "Elephant", "Cat", "Rabbit"],
      ans: 1,
    },
  ];
  const [chosen, setChosen] = useState<Record<number, number>>({});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {questions.map((q, qi) => (
        <div key={qi}>
          <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: dark, marginBottom: 8 }}>
            {qi + 1}. {q.q}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {q.opts.map((opt, oi) => {
              const picked = chosen[qi] === oi;
              const correct = oi === q.ans;
              const revealed = chosen[qi] !== undefined;
              const bg = picked
                ? correct
                  ? "#d4edda"
                  : "#f8d7da"
                : revealed && correct
                ? "#d4edda"
                : "#f8f9fa";
              const border = picked
                ? correct
                  ? accent
                  : "#e74c3c"
                : revealed && correct
                ? accent
                : "#e2e8f0";
              return (
                <button
                  key={oi}
                  onClick={() => !revealed && setChosen((c) => ({ ...c, [qi]: oi }))}
                  style={{
                    fontFamily: P,
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `2px solid ${border}`,
                    background: bg,
                    color: dark,
                    cursor: revealed ? "default" : "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {revealed && correct && <span className="material-icons-round" style={{ fontSize: 14, color: accent }}>check</span>}
                  {revealed && picked && !correct && <span className="material-icons-round" style={{ fontSize: 14, color: "#e74c3c" }}>close</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Mini Matching Game ─── */
function MiniMatchGame() {
  const pairs = [
    { emoji: "🐱", label: "Cat" },
    { emoji: "🐶", label: "Dog" },
    { emoji: "🐘", label: "Elephant" },
    { emoji: "🐦", label: "Bird" },
  ];

  const leftItems = pairs.map((p) => p.emoji);
  const rightItems = [...pairs.map((p) => p.label)].sort(() => Math.random() - 0.5);

  const [leftSel, setLeftSel] = useState<number | null>(null);
  const [rightSel, setRightSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);

  const handleLeft = (i: number) => {
    if (matched.includes(i)) return;
    setLeftSel(i);
    if (rightSel !== null) {
      const expectedLabel = pairs[i].label;
      if (rightItems[rightSel] === expectedLabel) {
        setMatched((m) => [...m, i]);
      }
      setLeftSel(null);
      setRightSel(null);
    }
  };

  const handleRight = (ri: number) => {
    setRightSel(ri);
    if (leftSel !== null) {
      const expectedLabel = pairs[leftSel].label;
      if (rightItems[ri] === expectedLabel) {
        setMatched((m) => [...m, leftSel]);
      }
      setLeftSel(null);
      setRightSel(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {leftItems.map((emoji, i) => {
          const isMatched = matched.includes(i);
          const isSelected = leftSel === i;
          return (
            <button
              key={i}
              onClick={() => handleLeft(i)}
              disabled={isMatched}
              style={{
                fontFamily: P,
                fontSize: 18,
                padding: "8px 0",
                borderRadius: 12,
                border: `2px solid ${isMatched ? accent : isSelected ? primary : "#e2e8f0"}`,
                background: isMatched ? accent + "18" : isSelected ? primary + "12" : "#fff",
                cursor: isMatched ? "default" : "pointer",
                opacity: isMatched ? 0.6 : 1,
                transition: "all 0.15s",
              }}
            >
              {emoji}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {rightItems.map((label, ri) => {
          const matchedPairIdx = pairs.findIndex((p) => p.label === label);
          const isMatched = matched.includes(matchedPairIdx);
          const isSelected = rightSel === ri;
          return (
            <button
              key={ri}
              onClick={() => handleRight(ri)}
              disabled={isMatched}
              style={{
                fontFamily: P,
                fontSize: 12,
                fontWeight: 600,
                padding: "10px 0",
                borderRadius: 12,
                border: `2px solid ${isMatched ? accent : isSelected ? primary : "#e2e8f0"}`,
                background: isMatched ? accent + "18" : isSelected ? primary + "12" : "#fff",
                color: dark,
                cursor: isMatched ? "default" : "pointer",
                opacity: isMatched ? 0.6 : 1,
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Result Card ─── */
function ResultCard({
  icon,
  label,
  color,
  children,
  approved,
  onApprove,
}: {
  icon: string;
  label: string;
  color: string;
  children: React.ReactNode;
  approved: boolean;
  onApprove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ background: color, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span className="material-icons-round" style={{ fontSize: 20, color: "#fff" }}>{icon}</span>
        <span style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: "#fff", flex: 1 }}>{label}</span>
        <button
          onClick={onApprove}
          style={{
            fontFamily: P,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 20,
            border: "2px solid rgba(255,255,255,0.5)",
            background: approved ? "rgba(255,255,255,0.25)" : "transparent",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {approved ? (
            <><span className="material-icons-round" style={{ fontSize: 13 }}>check</span>Approved</>
          ) : "Approve"}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px", flex: 1 }}>{children}</div>

      {/* Assign button */}
      <div style={{ padding: "0 18px 16px" }}>
        <button
          style={{
            width: "100%",
            fontFamily: P,
            fontSize: 13,
            fontWeight: 600,
            padding: "9px 0",
            borderRadius: 12,
            border: `2px solid ${color}`,
            background: color + "10",
            color,
            cursor: "pointer",
          }}
        >
          Assign to Student
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function AIActivityGeneratorPage() {
  const navigate = useNavigate();

  const [age, setAge] = useState(8);
  const [level, setLevel] = useState("Basic");
  const [topic, setTopic] = useState("Animals");
  const [difficulty, setDifficulty] = useState("Easy");
  const [activityTypes, setActivityTypes] = useState<string[]>(["Flashcards"]);
  const [focus, setFocus] = useState("Visual Learning");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [approved, setApproved] = useState<Record<string, boolean>>({
    Flashcards: false,
    Quiz: false,
    Story: false,
    "Matching Game": false,
  });

  const toggleType = (t: string) =>
    setActivityTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const toggleApprove = (k: string) =>
    setApproved((a) => ({ ...a, [k]: !a[k] }));

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2500);
  };

  const fieldLabel = (label: string) => (
    <div style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: muted, marginBottom: 6, letterSpacing: "0.03em" }}>
      {label}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: P,
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 12,
    border: "2px solid #e2e8f0",
    color: dark,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F4F8" }}>
      <Sidebar active="AI Generator" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <TopBar
          title="AI Activity Generator"
          subtitle="Powered by Generative AI — Create personalized learning activities instantly"
        />

        <div style={{ padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* ─── Left Panel ─── */}
          <div style={{ width: 420, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Form Card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <span className="material-icons-round" style={{ fontSize: 24, color: primary }}>auto_awesome</span>
                <span style={{ fontFamily: P, fontWeight: 700, fontSize: 18, color: dark }}>Generate Activity</span>
                <span
                  style={{
                    fontFamily: P,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 20,
                    background: "#e67e2218",
                    color: "#e67e22",
                    marginLeft: 4,
                  }}
                >
                  Beta
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Age */}
                <div>
                  {fieldLabel("Student Age")}
                  <input
                    type="number"
                    min={4}
                    max={18}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    style={inputStyle}
                  />
                </div>

                {/* Level */}
                <div>
                  {fieldLabel("Learning Level")}
                  <select value={level} onChange={(e) => setLevel(e.target.value)} style={inputStyle}>
                    {["Pre-Academic", "Basic", "Intermediate", "Advanced"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Topic */}
                <div>
                  {fieldLabel("Topic")}
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Animals, Colours, Numbers"
                    style={inputStyle}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  {fieldLabel("Difficulty")}
                  <DifficultyToggle value={difficulty} onChange={setDifficulty} />
                </div>

                {/* Activity Types */}
                <div>
                  {fieldLabel("Activity Type (multi-select)")}
                  <ActivityChips selected={activityTypes} onToggle={toggleType} />
                </div>

                {/* Special Focus */}
                <div>
                  {fieldLabel("Special Focus")}
                  <select value={focus} onChange={(e) => setFocus(e.target.value)} style={inputStyle}>
                    {["Visual Learning", "Motor Skills", "Communication", "Memory", "Social Skills"].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  style={{
                    background: loading ? "#94a3b8" : "linear-gradient(135deg,#1565C0,#27ae60)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 16,
                    padding: "20px 0",
                    fontFamily: P,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "background 0.2s",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(21,101,192,0.35)",
                  }}
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="material-icons-round"
                        style={{ fontSize: 22, display: "inline-block" }}
                      >
                        autorenew
                      </motion.span>
                      AI is generating...
                    </>
                  ) : (
                    <>
                      <span className="material-icons-round" style={{ fontSize: 22 }}>auto_awesome</span>
                      Generate Activity
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Integration Info Card */}
            <div
              style={{
                background: "#fffbeb",
                border: "2px solid #fcd34d",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <div style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 8 }}>
                🔗 Connect your AI
              </div>
              <div style={{ fontFamily: P, fontSize: 12, color: "#78350f", lineHeight: 1.7, marginBottom: 14 }}>
                To power real AI generation, add your API key to the environment. Supported: OpenAI GPT-4, Anthropic Claude, Google Gemini.
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                {[
                  { label: "OpenAI", color: accent },
                  { label: "Claude", color: "#e67e22" },
                  { label: "Gemini", color: primary },
                ].map(({ label, color }) => (
                  <button
                    key={label}
                    style={{
                      fontFamily: P,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: `2px solid ${color}`,
                      background: "transparent",
                      color,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#86efac",
                }}
              >
                VITE_AI_API_KEY=your_key_here
              </div>
            </div>
          </div>

          {/* ─── Right Panel ─── */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              {!generated && !loading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 480,
                    gap: 20,
                  }}
                >
                  <div style={{ fontSize: 80 }}>✨</div>
                  <div style={{ fontFamily: P, fontSize: 18, fontWeight: 700, color: dark }}>
                    Ready to Generate
                  </div>
                  <div style={{ fontFamily: P, fontSize: 14, color: muted, textAlign: "center", maxWidth: 340 }}>
                    Enter details and click Generate to create personalized learning activities powered by AI
                  </div>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 480,
                    gap: 20,
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    style={{ fontSize: 56 }}
                  >
                    ⚙️
                  </motion.div>
                  <div style={{ fontFamily: P, fontSize: 16, fontWeight: 600, color: primary }}>
                    AI is crafting your activities…
                  </div>
                  <div style={{ fontFamily: P, fontSize: 13, color: muted }}>Topic: {topic} · {difficulty} · Age {age}</div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
                >
                  {/* Flashcard Set */}
                  <ResultCard
                    icon="style"
                    label="Flashcard Set"
                    color={primary}
                    approved={approved["Flashcards"]}
                    onApprove={() => toggleApprove("Flashcards")}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <Flashcard front={`What is a ${topic.slice(0,-1) || "dog"}?`} back="A domesticated mammal kept as a pet." />
                      <Flashcard front={`How many legs does a ${topic === "Animals" ? "dog" : "cat"} have?`} back="4 legs." />
                      <Flashcard front={`What sound does a cow make?`} back="Moo!" />
                    </div>
                  </ResultCard>

                  {/* Quiz */}
                  <ResultCard
                    icon="quiz"
                    label="Quiz"
                    color={accent}
                    approved={approved["Quiz"]}
                    onApprove={() => toggleApprove("Quiz")}
                  >
                    <MiniQuiz topic={topic} />
                  </ResultCard>

                  {/* Story */}
                  <ResultCard
                    icon="auto_stories"
                    label="Story"
                    color="#8e44ad"
                    approved={approved["Story"]}
                    onApprove={() => toggleApprove("Story")}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <p style={{ fontFamily: P, fontSize: 13, color: dark, lineHeight: 1.8, margin: 0 }}>
                        Once upon a time, in a lush green forest, there lived many wonderful animals. 🌿 Every morning the birds sang sweet songs and the elephants walked gently by the river.
                      </p>
                      <p style={{ fontFamily: P, fontSize: 13, color: dark, lineHeight: 1.8, margin: 0 }}>
                        One day a little rabbit asked, "Why do animals have different colours?" The wise owl replied, "Each colour helps us live in our special home." 🦉
                      </p>
                    </div>
                  </ResultCard>

                  {/* Matching Game */}
                  <ResultCard
                    icon="grid_on"
                    label="Matching Game"
                    color="#e67e22"
                    approved={approved["Matching Game"]}
                    onApprove={() => toggleApprove("Matching Game")}
                  >
                    <div style={{ fontFamily: P, fontSize: 12, color: muted, marginBottom: 10 }}>
                      Tap an emoji, then tap its matching word.
                    </div>
                    <MiniMatchGame />
                  </ResultCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
