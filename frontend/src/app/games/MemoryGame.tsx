import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const originalCards = [
  "🍎",
  "🍎",
  "🐶",
  "🐶",
  "🚗",
  "🚗",
  "🌸",
  "🌸",
  "⭐",
  "⭐",
  "🐱",
  "🐱",
];

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const navigate = useNavigate();

  const [cards, setCards] = useState(shuffle(originalCards));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(90);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;

    if (time <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, finished]);

  useEffect(() => {
    if (flipped.length !== 2) return;

    setMoves((prev) => prev + 1);

    const first = flipped[0];
    const second = flipped[1];

    if (cards[first] === cards[second]) {
      setMatched((prev) => [...prev, first, second]);
      setScore((prev) => prev + 20);
      setFlipped([]);
    } else {
      setTimeout(() => {
        setFlipped([]);
      }, 800);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setFinished(true);
    }
  }, [matched, cards]);

  const flipCard = (index: number) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    ) {
      return;
    }

    setFlipped((prev) => [...prev, index]);
  };

  const restart = () => {
    setCards(shuffle(originalCards));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setTime(90);
    setFinished(false);
  };

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={{ fontSize: 70 }}>🧠🎉</div>

          <h1>Memory Master!</h1>

          <p>You completed the Memory Matching game.</p>

          <div style={styles.stats}>
            <div>
              <small>Score</small>
              <strong>{score}</strong>
            </div>

            <div>
              <small>Moves</small>
              <strong>{moves}</strong>
            </div>

            <div>
              <small>Time</small>
              <strong>{90 - time}s</strong>
            </div>
          </div>

          <button
            style={styles.primaryButton}
            onClick={restart}
          >
            🔄 Play Again
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/activities")}
          >
            ← Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <button
            style={styles.exit}
            onClick={() => navigate("/activities")}
          >
            ← Exit
          </button>

          <h2>🧠 Memory Matching</h2>

          <div style={styles.score}>
            ⭐ {score}
          </div>
        </div>

        <div style={styles.info}>
          <span>
            Matches: {matched.length / 2} / {cards.length / 2}
          </span>

          <span>
            Moves: {moves}
          </span>

          <strong>
            ⏱️ {time}s
          </strong>
        </div>

        <div style={styles.progressBackground}>
          <div
            style={{
              ...styles.progress,
              width: `${(matched.length / cards.length) * 100}%`,
            }}
          />
        </div>

        <div style={styles.grid}>
          {cards.map((card, index) => {
            const isFlipped =
              flipped.includes(index) ||
              matched.includes(index);

            return (
              <button
                key={index}
                onClick={() => flipCard(index)}
                style={{
                  ...styles.card,
                  background: isFlipped
                    ? "#fff"
                    : "#1565C0",
                  transform: isFlipped
                    ? "rotateY(0deg)"
                    : "rotateY(0deg)",
                }}
              >
                {isFlipped ? (
                  <span style={styles.cardEmoji}>
                    {card}
                  </span>
                ) : (
                  <span style={styles.question}>?</span>
                )}
              </button>
            );
          })}
        </div>

        <p style={styles.help}>
          Find two matching cards!
        </p>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#EEF5FF",
    padding: "30px",
    fontFamily: "Poppins, sans-serif",
  },

  container: {
    maxWidth: "850px",
    margin: "auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  exit: {
    border: "none",
    background: "none",
    color: "#1565C0",
    cursor: "pointer",
    fontWeight: 600,
  },

  score: {
    background: "#fff",
    padding: "10px 18px",
    borderRadius: "14px",
    color: "#1565C0",
    fontWeight: 700,
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    margin: "25px 0 10px",
    color: "#546E7A",
  },

  progressBackground: {
    height: "8px",
    background: "#D8E5F0",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "25px",
  },

  progress: {
    height: "100%",
    background: "#27AE60",
    transition: ".3s",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    maxWidth: "600px",
    margin: "auto",
  },

  card: {
    height: "130px",
    borderRadius: "20px",
    border: "none",
    boxShadow: "0 5px 15px rgba(0,0,0,.10)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: ".25s",
  },

  question: {
    fontSize: "42px",
    color: "#fff",
    fontWeight: 700,
  },

  cardEmoji: {
    fontSize: "55px",
  },

  help: {
    textAlign: "center",
    color: "#78909C",
    marginTop: "25px",
  },

  resultCard: {
    background: "#fff",
    maxWidth: "500px",
    margin: "120px auto",
    padding: "45px",
    borderRadius: "30px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,.1)",
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    background: "#E3F2FD",
    padding: "20px",
    borderRadius: "20px",
    margin: "25px 0",
  },

  primaryButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "#1565C0",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    marginBottom: "10px",
  },

  secondaryButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "#E3F2FD",
    color: "#1565C0",
    cursor: "pointer",
    fontWeight: 600,
  },
};