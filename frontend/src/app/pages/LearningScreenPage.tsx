import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

// ─── Style constants ───────────────────────────────────────────────────────────
const P = "Poppins, sans-serif";
// primary blue: #1565C0, green: #27ae60, bg: #F0F6FF, dark: #0D2137

// ─── Mascot ───────────────────────────────────────────────────────────────────
type MascotMood = "idle" | "happy" | "celebrate" | "thinking";

function Mascot({ mood }: { mood: MascotMood }) {
  const animProps = (() => {
    switch (mood) {
      case "happy":
        return {
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: 0.6, repeat: Infinity },
        };
      case "celebrate":
        return {
          animate: { scale: [1, 1.2, 1], rotate: [-10, 10, -10, 0] },
          transition: { duration: 0.4, repeat: Infinity },
        };
      case "thinking":
        return {
          animate: { rotate: [-5, 5, -5] },
          transition: { duration: 1.2, repeat: Infinity },
        };
      default:
        return {
          animate: { y: [0, -6, 0] },
          transition: { duration: 2, repeat: Infinity },
        };
    }
  })();

  return (
    <motion.div {...animProps} style={{ display: "inline-block" }}>
      <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="72" rx="34" ry="36" fill="#F4900C" />
        {/* Belly */}
        <ellipse cx="50" cy="78" rx="20" ry="24" fill="#FDEBD0" />
        {/* Left Wing */}
        <ellipse cx="18" cy="75" rx="10" ry="18" fill="#E67E22" transform="rotate(-20 18 75)" />
        {/* Right Wing */}
        <ellipse cx="82" cy="75" rx="10" ry="18" fill="#E67E22" transform="rotate(20 82 75)" />
        {/* Head */}
        <ellipse cx="50" cy="38" rx="28" ry="26" fill="#F4900C" />
        {/* Left Ear tuft */}
        <polygon points="26,18 20,4 34,14" fill="#E67E22" />
        {/* Right Ear tuft */}
        <polygon points="74,18 80,4 66,14" fill="#E67E22" />
        {/* Left Eye white */}
        <circle cx="37" cy="38" r="11" fill="white" />
        {/* Right Eye white */}
        <circle cx="63" cy="38" r="11" fill="white" />
        {/* Left Pupil */}
        <circle cx="38" cy="39" r="6" fill="#0D2137" />
        {/* Right Pupil */}
        <circle cx="64" cy="39" r="6" fill="#0D2137" />
        {/* Left Eye shine */}
        <circle cx="40" cy="36" r="2" fill="white" />
        {/* Right Eye shine */}
        <circle cx="66" cy="36" r="2" fill="white" />
        {/* Beak */}
        <polygon points="50,46 44,54 56,54" fill="#F39C12" />
        {/* Feet */}
        <ellipse cx="38" cy="106" rx="8" ry="4" fill="#E67E22" />
        <ellipse cx="62" cy="106" rx="8" ry="4" fill="#E67E22" />
        {/* Belly texture lines */}
        <path d="M42 70 Q50 66 58 70" stroke="#F4D03F" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M40 78 Q50 74 60 78" stroke="#F4D03F" strokeWidth="1.5" fill="none" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

// ─── Speech Bubble ────────────────────────────────────────────────────────────
function SpeechBubble({ message }: { message: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, scale: 0.85, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        style={{
          background: "white",
          borderRadius: 16,
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: P,
          fontWeight: 600,
          color: "#0D2137",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          position: "relative",
          maxWidth: 160,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {message}
        {/* Tail */}
        <div style={{
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "10px solid white",
        }} />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────
function Timer({ seconds, total }: { seconds: number; total: number }) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const isOrange = seconds < 60;
  const isRed = seconds < 20;

  return (
    <motion.div
      animate={isRed ? { scale: [1, 1.06, 1] } : {}}
      transition={isRed ? { duration: 0.6, repeat: Infinity } : {}}
      style={{
        background: isRed ? "#FFF0F0" : isOrange ? "#FFF8EE" : "white",
        border: `2.5px solid ${isRed ? "#E53935" : isOrange ? "#FB8C00" : "#1565C0"}`,
        borderRadius: 999,
        padding: "6px 18px",
        fontFamily: P,
        fontWeight: 700,
        fontSize: 18,
        color: isRed ? "#E53935" : isOrange ? "#E65100" : "#1565C0",
        letterSpacing: 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        minWidth: 90,
        textAlign: "center",
      }}
    >
      {/* eslint-disable-next-line */}
      ⏱ {mins}:{secs}
    </motion.div>
  );
}

// ─── Game Progress Bar ────────────────────────────────────────────────────────
function GameProgressBar({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min((done / total) * 100, 100) : 0;
  return (
    <div style={{ background: "#E0E9FF", borderRadius: 999, height: 10, overflow: "hidden" }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{ height: "100%", background: color, borderRadius: 999 }}
      />
    </div>
  );
}

// ─── Celebration Burst ────────────────────────────────────────────────────────
const CONFETTI = ["🎉", "⭐", "🌟", "✨", "🎊", "💫", "🏆", "🌈"];

function CelebrationBurst() {
  const items = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    emoji: CONFETTI[i % CONFETTI.length],
    x: (Math.random() - 0.5) * 500,
    delay: Math.random() * 0.4,
    size: 20 + Math.random() * 20,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: 0, x: item.x * 0.2, opacity: 1, scale: 0.5 }}
          animate={{ y: -400, x: item.x, opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.4, delay: item.delay, ease: "easeOut" }}
          style={{ position: "absolute", fontSize: item.size }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Score Card ───────────────────────────────────────────────────────────────
function ScoreCard({
  score,
  total,
  time,
  activityTitle,
  onNext,
  onRetry,
}: {
  score: number;
  total: number;
  time: number;
  activityTitle: string;
  onNext: () => void;
  onRetry: () => void;
}) {
  const pct = total > 0 ? score / total : 0;
  const stars = pct >= 1 ? 3 : pct >= 0.66 ? 2 : 1;
  const timeTaken = 120 - time;
  const mins = Math.floor(timeTaken / 60).toString().padStart(2, "0");
  const secs = (timeTaken % 60).toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,33,55,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        fontFamily: P,
      }}
    >
      <div style={{
        background: "white",
        borderRadius: 28,
        padding: "48px 40px",
        maxWidth: 420,
        width: "90%",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0D2137", margin: "0 0 4px" }}>
          {activityTitle}
        </h2>
        <p style={{ color: "#546E7A", fontSize: 15, margin: "0 0 24px" }}>Activity Complete!</p>

        <div style={{ fontSize: 52, fontWeight: 900, color: "#1565C0", marginBottom: 4 }}>
          {score}<span style={{ fontSize: 28, color: "#90A4AE" }}>/{total}</span>
        </div>
        <p style={{ color: "#78909C", fontSize: 14, margin: "0 0 16px" }}>Time: {mins}:{secs}</p>

        <div style={{ fontSize: 36, marginBottom: 24 }}>
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ opacity: i < stars ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <Link
            to="/activities"
            onClick={onNext}
            style={{
              background: "#1565C0",
              color: "white",
              borderRadius: 16,
              padding: "18px 32px",
              fontFamily: P,
              fontWeight: 700,
              fontSize: 18,
              textDecoration: "none",
              display: "block",
            }}
          >
            Next Activity 🚀
          </Link>
          <button
            onClick={onRetry}
            style={{
              background: "#F0F6FF",
              color: "#1565C0",
              border: "2px solid #1565C0",
              borderRadius: 16,
              padding: "16px 32px",
              fontFamily: P,
              fontWeight: 700,
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Activity Registry ────────────────────────────────────────────────────────
type GameType = "drag-match" | "tap-match" | "letter-match" | "picture-id";

interface ActivityConfig {
  title: string;
  instruction: string;
  color: string;
  icon: string;
  totalItems: number;
  gameType: GameType;
}

const REGISTRY: Record<string, ActivityConfig> = {
  "shape-matching": {
    title: "Shape Matching",
    instruction: "Drag each shape to its matching outline!",
    color: "#7B1FA2",
    icon: "🔷",
    totalItems: 4,
    gameType: "drag-match",
  },
  "colour-matching": {
    title: "Colour Matching",
    instruction: "Tap a colour, then tap its name!",
    color: "#E91E8C",
    icon: "🎨",
    totalItems: 4,
    gameType: "tap-match",
  },
  "animal-matching": {
    title: "Animal Matching",
    instruction: "Match each animal to its name!",
    color: "#27ae60",
    icon: "🐾",
    totalItems: 4,
    gameType: "tap-match",
  },
  "alphabet-matching": {
    title: "Alphabet Matching",
    instruction: "Match each big letter to its small letter!",
    color: "#1565C0",
    icon: "🔤",
    totalItems: 4,
    gameType: "letter-match",
  },
  "fruit-matching": {
    title: "Fruit Matching",
    instruction: "Tap a fruit, then tap its name!",
    color: "#F57F17",
    icon: "🍎",
    totalItems: 4,
    gameType: "tap-match",
  },
  "picture-id": {
    title: "Picture ID",
    instruction: "Tap the correct answer for each picture!",
    color: "#00838F",
    icon: "🖼️",
    totalItems: 4,
    gameType: "picture-id",
  },
  "drag-drop-sorting": {
    title: "Sorting Game",
    instruction: "Sort animals and vehicles into the right bins!",
    color: "#AD1457",
    icon: "🗂️",
    totalItems: 6,
    gameType: "drag-match",
  },
  "number-matching": {
    title: "Number Matching",
    instruction: "Match each number to its dot pattern!",
    color: "#1565C0",
    icon: "🔢",
    totalItems: 4,
    gameType: "letter-match",
  },
  "size-sorting": {
    title: "Size Sorting",
    instruction: "Tap the circles from smallest to largest!",
    color: "#6A1B9A",
    icon: "📏",
    totalItems: 3,
    gameType: "picture-id",
  },
  "sound-matching": {
    title: "Sound Matching",
    instruction: "Match each animal to the sound it makes!",
    color: "#00695C",
    icon: "🔊",
    totalItems: 4,
    gameType: "tap-match",
  },
};

// ─── Shape SVGs ───────────────────────────────────────────────────────────────
interface ShapeDef {
  label: string;
  color: string;
  element: React.ReactNode;
}

const SHAPES: Record<string, ShapeDef> = {
  circle: {
    label: "Circle",
    color: "#42A5F5",
    element: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="#42A5F5" />
        <circle cx="28" cy="24" r="8" fill="white" opacity="0.35" />
      </svg>
    ),
  },
  square: {
    label: "Square",
    color: "#66BB6A",
    element: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <rect x="6" y="6" width="68" height="68" rx="10" fill="#66BB6A" />
        <rect x="14" y="12" width="20" height="12" rx="4" fill="white" opacity="0.35" />
      </svg>
    ),
  },
  triangle: {
    label: "Triangle",
    color: "#FFA726",
    element: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <polygon points="40,6 74,74 6,74" fill="#FFA726" />
        <polygon points="40,14 52,36 28,36" fill="white" opacity="0.3" />
      </svg>
    ),
  },
  star: {
    label: "Star",
    color: "#AB47BC",
    element: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <polygon
          points="40,6 49,30 75,30 54,47 62,72 40,56 18,72 26,47 5,30 31,30"
          fill="#AB47BC"
        />
        <circle cx="40" cy="30" r="6" fill="white" opacity="0.3" />
      </svg>
    ),
  },
};

// ─── Drag-Match Game: Shape Matching ─────────────────────────────────────────
function ShapeMatchGame({ onScore }: { onScore: (n: number) => void }) {
  const shapeIds = ["circle", "square", "triangle", "star"];
  const [placed, setPlaced] = useState<Record<string, string>>({}); // zoneId -> shapeId
  const [wrong, setWrong] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const score = shapeIds.filter((id) => placed[id] === id).length;

  useEffect(() => { onScore(score); }, [score, onScore]);

  const handleDrop = (zoneId: string, e: React.DragEvent) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData("shapeId");
    if (shapeId === zoneId) {
      setPlaced((p) => ({ ...p, [zoneId]: shapeId }));
    } else {
      setWrong(zoneId);
      setTimeout(() => setWrong(null), 700);
    }
  };

  const placedShapeIds = new Set(Object.values(placed));

  return (
    <div style={{ width: "100%", fontFamily: P }}>
      {/* Drop Zones */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        {shapeIds.map((id) => {
          const shape = SHAPES[id];
          const isCorrect = placed[id] === id;
          const isWrong = wrong === id;
          return (
            <div
              key={id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(id, e)}
              style={{
                width: 110,
                height: 130,
                borderRadius: 16,
                border: `3px dashed ${isCorrect ? "#27ae60" : isWrong ? "#E53935" : "#90A4AE"}`,
                background: isCorrect ? "#E8F5E9" : isWrong ? "#FFEBEE" : "#F8F9FA",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
            >
              {isCorrect ? (
                <>
                  {shape.element}
                  <span style={{ fontSize: 22 }}>✅</span>
                </>
              ) : (
                <>
                  <div style={{ opacity: 0.2 }}>{shape.element}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#546E7A" }}>{shape.label}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Draggable Pool */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {shapeIds.map((id) => {
          const shape = SHAPES[id];
          const isPlaced = placedShapeIds.has(id);
          return (
            <motion.div
              key={id}
              animate={isPlaced ? { opacity: 0.25, scale: 0.9 } : { opacity: 1, scale: 1 }}
              draggable={!isPlaced}
              onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                e.dataTransfer.setData("shapeId", id);
                setDragging(id);
              }}
              onDragEnd={() => setDragging(null)}
              style={{
                width: 110,
                height: 130,
                borderRadius: 16,
                background: `${shape.color}22`,
                border: `3px solid ${dragging === id ? shape.color : shape.color + "88"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: isPlaced ? "default" : "grab",
                userSelect: "none",
              }}
            >
              {shape.element}
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0D2137" }}>{shape.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Drag-Match Game: Sorting ─────────────────────────────────────────────────
const SORT_ITEMS = [
  { id: "dog", label: "Dog 🐕", category: "animals" },
  { id: "cat", label: "Cat 🐱", category: "animals" },
  { id: "bird", label: "Bird 🐦", category: "animals" },
  { id: "car", label: "Car 🚗", category: "vehicles" },
  { id: "bus", label: "Bus 🚌", category: "vehicles" },
  { id: "plane", label: "Plane ✈️", category: "vehicles" },
];

const BINS = [
  { id: "animals", label: "Animals 🐾", color: "#27ae60" },
  { id: "vehicles", label: "Vehicles 🚗", color: "#1565C0" },
];

function SortingGame({ onScore }: { onScore: (n: number) => void }) {
  const [binContents, setBinContents] = useState<Record<string, string[]>>({
    animals: [],
    vehicles: [],
  });
  const [wrongBin, setWrongBin] = useState<string | null>(null);

  const allSorted = Object.values(binContents).flat();
  const score = allSorted.filter((itemId) => {
    const item = SORT_ITEMS.find((i) => i.id === itemId)!;
    const binId = Object.entries(binContents).find(([, ids]) => ids.includes(itemId))?.[0];
    return item.category === binId;
  }).length;

  useEffect(() => { onScore(score); }, [score, onScore]);

  const handleDrop = (binId: string, e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    const item = SORT_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    if (item.category === binId) {
      setBinContents((prev) => ({
        ...prev,
        [binId]: [...prev[binId], itemId],
      }));
    } else {
      setWrongBin(binId);
      setTimeout(() => setWrongBin(null), 700);
    }
  };

  const sortedIds = new Set(Object.values(binContents).flat());

  return (
    <div style={{ width: "100%", fontFamily: P }}>
      {/* Bins */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
        {BINS.map((bin) => (
          <div
            key={bin.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(bin.id, e)}
            style={{
              flex: 1,
              minHeight: 130,
              maxWidth: 200,
              borderRadius: 20,
              border: `3px dashed ${wrongBin === bin.id ? "#E53935" : bin.color}`,
              background: wrongBin === bin.id ? "#FFEBEE" : `${bin.color}18`,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 15, color: bin.color, marginBottom: 4 }}>{bin.label}</span>
            {binContents[bin.id].map((itemId) => {
              const item = SORT_ITEMS.find((i) => i.id === itemId)!;
              return (
                <div key={itemId} style={{
                  background: `${bin.color}33`,
                  borderRadius: 10,
                  padding: "6px 10px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0D2137",
                }}>
                  {item.label} ✅
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Items pool */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {SORT_ITEMS.map((item) => {
          const isPlaced = sortedIds.has(item.id);
          return (
            <motion.div
              key={item.id}
              animate={isPlaced ? { opacity: 0.2, scale: 0.9 } : { opacity: 1, scale: 1 }}
              draggable={!isPlaced}
              onDragStart={(e: React.DragEvent<HTMLDivElement>) => e.dataTransfer.setData("itemId", item.id)}
              style={{
                padding: "12px 18px",
                background: "white",
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                color: "#0D2137",
                border: "2px solid #B0BEC5",
                cursor: isPlaced ? "default" : "grab",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {item.label}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tap-Match Game ───────────────────────────────────────────────────────────
interface TapMatchPair {
  id: string;
  leftLabel: React.ReactNode;
  rightLabel: string;
}

function TapMatchGame({
  pairs,
  onScore,
}: {
  pairs: TapMatchPair[];
  onScore: (n: number) => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [wrongLeft, setWrongLeft] = useState<string | null>(null);
  const [wrongRight, setWrongRight] = useState<string | null>(null);

  const score = locked.size;
  useEffect(() => { onScore(score); }, [score, onScore]);

  const shuffledRight = useRef(
    [...pairs].sort(() => Math.random() - 0.5)
  ).current;

  const handleLeftTap = (id: string) => {
    if (locked.has(id)) return;
    setSelectedLeft((prev) => prev === id ? null : id);
  };

  const handleRightTap = (id: string) => {
    if (locked.has(id)) return;
    if (!selectedLeft) return;

    if (selectedLeft === id) {
      setLocked((prev) => new Set([...prev, id]));
      setSelectedLeft(null);
    } else {
      setWrongLeft(selectedLeft);
      setWrongRight(id);
      setTimeout(() => {
        setWrongLeft(null);
        setWrongRight(null);
        setSelectedLeft(null);
      }, 700);
    }
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 16,
    padding: "14px 10px",
    minWidth: 100,
    minHeight: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontFamily: P,
    fontWeight: 700,
    fontSize: 15,
    transition: "all 0.15s",
    userSelect: "none",
    border: "3px solid transparent",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", width: "100%", fontFamily: P }}>
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pairs.map((p) => {
          const isLocked = locked.has(p.id);
          const isSelected = selectedLeft === p.id;
          const isWrong = wrongLeft === p.id;
          return (
            <motion.div
              key={p.id}
              animate={isWrong ? { x: [-6, 6, -6, 0] } : {}}
              transition={{ duration: 0.3 }}
              onClick={() => handleLeftTap(p.id)}
              style={{
                ...cardBase,
                background: isLocked ? "#E8F5E9" : isSelected ? "#E3F2FD" : "white",
                border: `3px solid ${isLocked ? "#27ae60" : isWrong ? "#E53935" : isSelected ? "#1565C0" : "#CFD8DC"}`,
                color: "#0D2137",
                fontSize: 32,
              }}
            >
              {p.leftLabel}
              {isLocked && <span style={{ fontSize: 18, marginLeft: 4 }}>✅</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shuffledRight.map((p) => {
          const isLocked = locked.has(p.id);
          const isWrong = wrongRight === p.id;
          const isHinted = selectedLeft !== null && !isLocked;
          return (
            <motion.div
              key={p.id}
              animate={isWrong ? { x: [-6, 6, -6, 0] } : {}}
              transition={{ duration: 0.3 }}
              onClick={() => handleRightTap(p.id)}
              style={{
                ...cardBase,
                background: isLocked ? "#E8F5E9" : isWrong ? "#FFEBEE" : isHinted ? "#F8FBFF" : "white",
                border: `3px solid ${isLocked ? "#27ae60" : isWrong ? "#E53935" : isHinted ? "#90CAF9" : "#CFD8DC"}`,
                color: isLocked ? "#27ae60" : "#0D2137",
              }}
            >
              {p.rightLabel}
              {isLocked && " ✅"}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Picture ID Game ──────────────────────────────────────────────────────────
const PIC_QUESTIONS = [
  { id: "sun", emoji: "🌞", label: "Sun", options: ["Sun", "Moon", "Star", "Cloud"] },
  { id: "house", emoji: "🏠", label: "House", options: ["Car", "House", "Tree", "Boat"] },
  { id: "car", emoji: "🚗", label: "Car", options: ["Bus", "Train", "Car", "Plane"] },
  { id: "tree", emoji: "🌳", label: "Tree", options: ["Flower", "Rock", "Tree", "River"] },
];

function PictureIDGame({ onScore }: { onScore: (n: number) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);

  const score = Object.values(answered).filter(Boolean).length;
  useEffect(() => { onScore(score); }, [score, onScore]);

  const q = PIC_QUESTIONS[currentQ];
  const shuffledOptions = useRef(
    PIC_QUESTIONS.map((pq) => [...pq.options].sort(() => Math.random() - 0.5))
  ).current;

  const handleAnswer = (opt: string) => {
    if (feedback || answered[currentQ]) return;
    if (opt === q.label) {
      setFeedback("correct");
      setAnswered((prev) => ({ ...prev, [currentQ]: true }));
      setTimeout(() => {
        setFeedback(null);
        if (currentQ < PIC_QUESTIONS.length - 1) setCurrentQ((c) => c + 1);
      }, 600);
    } else {
      setFeedback("wrong");
      setWrongOpt(opt);
      setTimeout(() => {
        setFeedback(null);
        setWrongOpt(null);
      }, 700);
    }
  };

  return (
    <div style={{ width: "100%", fontFamily: P, textAlign: "center" }}>
      <motion.div
        key={currentQ}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          fontSize: 100,
          marginBottom: 8,
          filter: feedback === "correct" ? "drop-shadow(0 0 20px #27ae60)" : undefined,
        }}
      >
        {q.emoji}
      </motion.div>
      <p style={{ fontSize: 15, color: "#546E7A", marginBottom: 20 }}>
        Question {currentQ + 1} of {PIC_QUESTIONS.length}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 340, margin: "0 auto" }}>
        {shuffledOptions[currentQ].map((opt) => {
          const isCorrect = feedback === "correct" && opt === q.label;
          const isWrong = wrongOpt === opt;
          return (
            <motion.button
              key={opt}
              animate={isWrong ? { x: [-6, 6, -6, 0] } : isCorrect ? { scale: [1, 1.08, 1] } : {}}
              onClick={() => handleAnswer(opt)}
              style={{
                padding: "18px 12px",
                borderRadius: 16,
                border: `3px solid ${isCorrect ? "#27ae60" : isWrong ? "#E53935" : "#CFD8DC"}`,
                background: isCorrect ? "#E8F5E9" : isWrong ? "#FFEBEE" : "white",
                fontFamily: P,
                fontWeight: 700,
                fontSize: 16,
                color: "#0D2137",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
        {PIC_QUESTIONS.map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: "50%",
            background: answered[i] ? "#27ae60" : i === currentQ ? "#1565C0" : "#CFD8DC",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Size Sorting Game ────────────────────────────────────────────────────────
const SIZE_ITEMS = [
  { id: "small", label: "Small", size: 48, correct: 0 },
  { id: "medium", label: "Medium", size: 80, correct: 1 },
  { id: "large", label: "Large", size: 112, correct: 2 },
];

function SizeSortingGame({ onScore }: { onScore: (n: number) => void }) {
  const shuffledRef = useRef([...SIZE_ITEMS].sort(() => Math.random() - 0.5));
  const [tapOrder, setTapOrder] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const score = (() => {
    let s = 0;
    for (let i = 0; i < tapOrder.length; i++) {
      const item = SIZE_ITEMS.find((x) => x.id === tapOrder[i]);
      if (item && item.correct === i) s++;
    }
    return s;
  })();

  useEffect(() => { if (done) onScore(score); }, [score, done, onScore]);

  const handleTap = (id: string) => {
    if (done || tapOrder.includes(id)) return;
    const newOrder = [...tapOrder, id];
    setTapOrder(newOrder);
    if (newOrder.length === SIZE_ITEMS.length) {
      setDone(true);
    }
  };

  return (
    <div style={{ width: "100%", textAlign: "center", fontFamily: P }}>
      <p style={{ color: "#546E7A", fontSize: 15, marginBottom: 24 }}>
        Tap from smallest to largest!
      </p>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "flex-end", marginBottom: 24 }}>
        {shuffledRef.current.map((item) => {
          const tappedIndex = tapOrder.indexOf(item.id);
          const isTapped = tappedIndex !== -1;
          const isCorrect = done && SIZE_ITEMS.find((x) => x.id === item.id)!.correct === tappedIndex;
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleTap(item.id)}
              style={{
                width: item.size,
                height: item.size,
                borderRadius: "50%",
                background: isTapped
                  ? (isCorrect || !done) ? "#42A5F5" : "#EF5350"
                  : "#90CAF9",
                border: "4px solid #1565C0",
                cursor: isTapped ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                transition: "background 0.3s",
              }}
            >
              {isTapped ? tappedIndex + 1 : ""}
            </motion.div>
          );
        })}
      </div>
      {done && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 18, fontWeight: 700, color: score === 3 ? "#27ae60" : "#E53935" }}
        >
          {score === 3 ? "Perfect! 🎉" : `${score}/3 correct!`}
        </motion.p>
      )}
    </div>
  );
}

// ─── Game Resolver ────────────────────────────────────────────────────────────
function GameView({
  activityId,
  onScore,
}: {
  activityId: string;
  onScore: (n: number) => void;
}) {
  switch (activityId) {
    case "shape-matching":
      return <ShapeMatchGame onScore={onScore} />;

    case "drag-drop-sorting":
      return <SortingGame onScore={onScore} />;

    case "colour-matching":
      return (
        <TapMatchGame
          pairs={[
            { id: "red", leftLabel: <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#E53935" }} />, rightLabel: "Red" },
            { id: "blue", leftLabel: <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#1565C0" }} />, rightLabel: "Blue" },
            { id: "green", leftLabel: <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#27ae60" }} />, rightLabel: "Green" },
            { id: "yellow", leftLabel: <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#F9A825" }} />, rightLabel: "Yellow" },
          ]}
          onScore={onScore}
        />
      );

    case "animal-matching":
      return (
        <TapMatchGame
          pairs={[
            { id: "cat", leftLabel: "🐱", rightLabel: "Cat" },
            { id: "dog", leftLabel: "🐕", rightLabel: "Dog" },
            { id: "bird", leftLabel: "🐦", rightLabel: "Bird" },
            { id: "fish", leftLabel: "🐟", rightLabel: "Fish" },
          ]}
          onScore={onScore}
        />
      );

    case "fruit-matching":
      return (
        <TapMatchGame
          pairs={[
            { id: "apple", leftLabel: "🍎", rightLabel: "Apple" },
            { id: "banana", leftLabel: "🍌", rightLabel: "Banana" },
            { id: "orange", leftLabel: "🍊", rightLabel: "Orange" },
            { id: "grape", leftLabel: "🍇", rightLabel: "Grape" },
          ]}
          onScore={onScore}
        />
      );

    case "sound-matching":
      return (
        <TapMatchGame
          pairs={[
            { id: "lion", leftLabel: "🦁", rightLabel: "Roar" },
            { id: "duck", leftLabel: "🦆", rightLabel: "Quack" },
            { id: "dogSound", leftLabel: "🐕", rightLabel: "Woof" },
            { id: "catSound", leftLabel: "🐱", rightLabel: "Meow" },
          ]}
          onScore={onScore}
        />
      );

    case "alphabet-matching":
      return (
        <TapMatchGame
          pairs={[
            { id: "A", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#E53935" }}>A</span>, rightLabel: "a" },
            { id: "B", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#1565C0" }}>B</span>, rightLabel: "b" },
            { id: "C", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#27ae60" }}>C</span>, rightLabel: "c" },
            { id: "D", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#F57F17" }}>D</span>, rightLabel: "d" },
          ]}
          onScore={onScore}
        />
      );

    case "number-matching":
      return (
        <TapMatchGame
          pairs={[
            { id: "1", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#1565C0" }}>1</span>, rightLabel: "•" },
            { id: "2", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#E53935" }}>2</span>, rightLabel: "• •" },
            { id: "3", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#27ae60" }}>3</span>, rightLabel: "• • •" },
            { id: "4", leftLabel: <span style={{ fontSize: 42, fontWeight: 900, color: "#F57F17" }}>4</span>, rightLabel: "• • • •" },
          ]}
          onScore={onScore}
        />
      );

    case "picture-id":
      return <PictureIDGame onScore={onScore} />;

    case "size-sorting":
      return <SizeSortingGame onScore={onScore} />;

    default:
      return (
        <div style={{ textAlign: "center", color: "#546E7A", fontFamily: P, fontSize: 18 }}>
          Activity not found.
        </div>
      );
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LearningScreenPage() {
  const { activityId = "shape-matching" } = useParams<{ activityId: string }>();
  const navigate = useNavigate();

  const config = REGISTRY[activityId] ?? REGISTRY["shape-matching"];
  const TOTAL_TIME = 120;

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [score, setScore] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const [message, setMessage] = useState("Let's play! 🎯");
  const [gameKey, setGameKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(true);

  const stopTimer = useCallback(() => {
    activeRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    activeRef.current = true;
    timerRef.current = setInterval(() => {
      if (!activeRef.current) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          setShowScore(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    setTimeLeft(TOTAL_TIME);
    setScore(0);
    setShowScore(false);
    setCelebrate(false);
    setMascotMood("idle");
    setMessage("Let's play! 🎯");
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey]);

  const handleScore = useCallback((n: number) => {
    setScore((prev) => {
      if (n > prev) {
        setMascotMood("happy");
        setMessage("Great job! ⭐");
        setTimeout(() => {
          setMascotMood("idle");
          setMessage("Keep going! 🎯");
        }, 1200);
      }
      return n;
    });
  }, []);

  const handleSubmit = () => {
    stopTimer();
    if (score === config.totalItems) {
      setCelebrate(true);
      setMascotMood("celebrate");
      setMessage("Amazing! 🎉");
      setTimeout(() => setCelebrate(false), 2200);
    }
    setShowScore(true);
  };

  const handleRetry = () => {
    setGameKey((k) => k + 1);
  };

  const allDone = score >= config.totalItems;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E8F4FD 0%, #E0F7EE 50%, #F0F0FF 100%)",
        fontFamily: P,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        gap: 12,
        flexShrink: 0,
      }}>
        <Link
          to="/activities"
          style={{
            background: "#F0F6FF",
            color: "#1565C0",
            border: "2px solid #1565C0",
            borderRadius: 14,
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          ← Back
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "center" }}>
          <span style={{ fontSize: 28 }}>{config.icon}</span>
          <h1 style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0D2137",
            margin: 0,
            letterSpacing: -0.3,
          }}>
            {config.title}
          </h1>
        </div>

        <Timer seconds={timeLeft} total={TOTAL_TIME} />
      </div>

      {/* ── Progress bar ── */}
      <div style={{ padding: "0 24px 0", background: "white", flexShrink: 0 }}>
        <GameProgressBar done={score} total={config.totalItems} color={config.color} />
      </div>

      {/* ── Instruction strip ── */}
      <div style={{
        textAlign: "center",
        padding: "10px 24px",
        background: `${config.color}18`,
        borderBottom: `2px solid ${config.color}33`,
        flexShrink: 0,
      }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: config.color }}>
          {config.instruction}
        </p>
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: "flex",
        gap: 0,
        padding: "24px 16px",
        maxWidth: 1000,
        margin: "0 auto",
        width: "100%",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}>
        {/* Mascot column */}
        <div style={{
          width: 170,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          paddingTop: 8,
          position: "sticky",
          top: 24,
        }}>
          <SpeechBubble message={message} />
          <Mascot mood={mascotMood} />

          {/* Score chip */}
          <div style={{
            background: "white",
            borderRadius: 14,
            padding: "8px 18px",
            fontWeight: 800,
            fontSize: 18,
            color: config.color,
            border: `2px solid ${config.color}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
            {score} / {config.totalItems}
          </div>
        </div>

        {/* Game area */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          paddingLeft: 16,
          minHeight: 340,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={gameKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <GameView activityId={activityId} onScore={handleScore} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        background: "white",
        borderTop: "2px solid #E8EDF5",
        padding: "16px 24px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Array.from({ length: config.totalItems }, (_, i) => (
            <div key={i} style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: i < score ? config.color : "#CFD8DC",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleRetry}
            style={{
              background: "#F0F6FF",
              color: "#1565C0",
              border: "2px solid #1565C0",
              borderRadius: 14,
              padding: "14px 22px",
              fontFamily: P,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
            aria-label="Reset game"
          >
            🔄 Reset
          </button>
          <motion.button
            whileHover={allDone ? { scale: 1.04 } : {}}
            whileTap={allDone ? { scale: 0.97 } : {}}
            onClick={allDone ? handleSubmit : undefined}
            disabled={!allDone}
            style={{
              background: allDone ? config.color : "#B0BEC5",
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "14px 28px",
              fontFamily: P,
              fontWeight: 800,
              fontSize: 17,
              cursor: allDone ? "pointer" : "not-allowed",
              opacity: allDone ? 1 : 0.65,
              transition: "background 0.3s, opacity 0.3s",
              boxShadow: allDone ? `0 4px 16px ${config.color}55` : "none",
            }}
            aria-label="Submit answers"
          >
            Submit ✅
          </motion.button>
        </div>
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>
        {celebrate && <CelebrationBurst />}
      </AnimatePresence>

      <AnimatePresence>
        {showScore && (
          <ScoreCard
            score={score}
            total={config.totalItems}
            time={timeLeft}
            activityTitle={config.title}
            onNext={() => navigate("/activities")}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
