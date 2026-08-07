import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const questions = [
  {
    image: "🌳",
    answer: "Tree",
    options: ["Tree", "Rock", "Flower", "River"],
  },
  {
    image: "🐶",
    answer: "Dog",
    options: ["Cat", "Dog", "Lion", "Bird"],
  },
  {
    image: "🍎",
    answer: "Apple",
    options: ["Banana", "Apple", "Orange", "Mango"],
  },
  {
    image: "🚗",
    answer: "Car",
    options: ["Bus", "Train", "Car", "Bike"],
  },
  {
    image: "🌸",
    answer: "Flower",
    options: ["Tree", "Flower", "Cloud", "Sun"],
  },
  {
    image: "🐟",
    answer: "Fish",
    options: ["Bird", "Fish", "Dog", "Horse"],
  },
];

export default function PictureIdentificationGame() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [selected, setSelected] = useState("");
  const [finished, setFinished] = useState(false);

  const question = questions[current];

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

  const chooseAnswer = (answer: string) => {
    if (selected) return;

    setSelected(answer);

    if (answer === question.answer) {
      setScore((prev) => prev + 10);
    }

    setTimeout(() => {
      if (current === questions.length - 1) {
        setFinished(true);
      } else {
        setCurrent((prev) => prev + 1);
        setSelected("");
      }
    }, 700);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setTime(60);
    setSelected("");
    setFinished(false);
  };

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={{ fontSize: 70 }}>🎉</div>

          <h1 style={styles.title}>Great Job!</h1>

          <p style={styles.subtitle}>
            You completed Picture Identification
          </p>

          <div style={styles.scoreBox}>
            <span>Final Score</span>
            <strong>{score}</strong>
          </div>

          <p style={styles.resultText}>
            You answered {Math.min(current + 1, questions.length)} questions.
          </p>

          <div style={styles.buttonRow}>
            <button style={styles.primaryButton} onClick={restart}>
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
      </div>
    );
  }

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.gameContainer}>

        {/* HEADER */}
        <div style={styles.header}>
          <button
            onClick={() => navigate("/activities")}
            style={styles.backButton}
          >
            ← Exit
          </button>

          <div style={styles.gameTitle}>
            🖼️ Picture Identification
          </div>

          <div style={styles.score}>
            ⭐ {score}
          </div>
        </div>

        {/* TOP INFO */}
        <div style={styles.infoRow}>
          <div>
            <span style={styles.infoLabel}>QUESTION</span>
            <strong>
              {current + 1} / {questions.length}
            </strong>
          </div>

          <div style={styles.timer}>
            ⏱️ {time}s
          </div>
        </div>

        {/* PROGRESS */}
        <div style={styles.progressBackground}>
          <div
            style={{
              ...styles.progress,
              width: `${progress}%`,
            }}
          />
        </div>

        {/* GAME CARD */}
        <div style={styles.card}>

          <p style={styles.questionText}>
            What is this?
          </p>

          {/* IMAGE */}
          <div style={styles.imageBox}>
            <span style={styles.emoji}>
              {question.image}
            </span>
          </div>

          {/* OPTIONS */}
          <div style={styles.options}>
            {question.options.map((option) => {
              const isCorrect = option === question.answer;
              const isSelected = selected === option;

              let background = "#fff";
              let border = "#D7E1EA";

              if (selected) {
                if (isCorrect) {
                  background = "#E8F5E9";
                  border = "#27AE60";
                } else if (isSelected) {
                  background = "#FFEBEE";
                  border = "#E53935";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => chooseAnswer(option)}
                  style={{
                    ...styles.option,
                    background,
                    borderColor: border,
                  }}
                >
                  {option}

                  {selected && isCorrect && (
                    <span> ✓</span>
                  )}

                  {selected && isSelected && !isCorrect && (
                    <span> ✕</span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* FOOTER */}
        <p style={styles.helpText}>
          Choose the correct answer
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#EAF5FB",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
  },

  gameContainer: {
    width: "100%",
    maxWidth: "900px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  gameTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#16324F",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#1565C0",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 600,
  },

  score: {
    background: "#fff",
    padding: "10px 18px",
    borderRadius: "14px",
    fontWeight: 700,
    color: "#1565C0",
    boxShadow: "0 3px 12px rgba(0,0,0,.08)",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    color: "#16324F",
  },

  infoLabel: {
    display: "block",
    fontSize: "11px",
    color: "#78909C",
    marginBottom: "3px",
  },

  timer: {
    background: "#fff",
    padding: "10px 18px",
    borderRadius: "14px",
    fontWeight: 700,
    color: "#E67E22",
  },

  progressBackground: {
    height: "8px",
    background: "#D7E8F0",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "25px",
  },

  progress: {
    height: "100%",
    background: "#27AE60",
    borderRadius: "20px",
    transition: "width .3s ease",
  },

  card: {
    background: "#fff",
    borderRadius: "28px",
    padding: "35px",
    boxShadow: "0 10px 35px rgba(21,101,192,.10)",
    textAlign: "center",
  },

  questionText: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#16324F",
    marginBottom: "20px",
  },

  imageBox: {
    width: "180px",
    height: "180px",
    margin: "0 auto 30px",
    borderRadius: "25px",
    background: "#E3F2FD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emoji: {
    fontSize: "100px",
  },

  options: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    maxWidth: "600px",
    margin: "0 auto",
  },

  option: {
    padding: "18px",
    borderRadius: "16px",
    border: "2px solid",
    fontSize: "16px",
    fontWeight: 600,
    color: "#16324F",
    cursor: "pointer",
    transition: ".2s",
  },

  helpText: {
    textAlign: "center",
    color: "#78909C",
    marginTop: "20px",
    fontSize: "13px",
  },

  resultCard: {
    background: "#fff",
    width: "100%",
    maxWidth: "500px",
    alignSelf: "center",
    borderRadius: "30px",
    padding: "45px",
    textAlign: "center",
    boxShadow: "0 15px 45px rgba(0,0,0,.1)",
  },

  title: {
    color: "#16324F",
    fontSize: "30px",
  },

  subtitle: {
    color: "#78909C",
  },

  scoreBox: {
    margin: "25px 0",
    background: "#E8F5E9",
    padding: "20px",
    borderRadius: "20px",
  },

  resultText: {
    color: "#546E7A",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "25px",
  },

  primaryButton: {
    padding: "13px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#1565C0",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "13px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#E3F2FD",
    color: "#1565C0",
    fontWeight: 600,
    cursor: "pointer",
  },
};