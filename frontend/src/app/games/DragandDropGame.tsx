import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const items = [
  { id: 1, name: "🍎 Apple", category: "Fruits" },
  { id: 2, name: "🍌 Banana", category: "Fruits" },
  { id: 3, name: "🚗 Car", category: "Vehicles" },
  { id: 4, name: "🚌 Bus", category: "Vehicles" },
  { id: 5, name: "🐶 Dog", category: "Animals" },
  { id: 6, name: "🐱 Cat", category: "Animals" },
];

const categories = ["Fruits", "Vehicles", "Animals"];

export default function DragDropGame() {
  const navigate = useNavigate();

  const [remaining, setRemaining] = useState(items);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [finished, setFinished] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);

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

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    category: string
  ) => {
    e.preventDefault();

    const id = Number(e.dataTransfer.getData("id"));
    const item = items.find((x) => x.id === id);

    if (!item) return;

    if (item.category === category) {
      setScore((prev) => prev + 10);

      setRemaining((prev) =>
        prev.filter((x) => x.id !== id)
      );

      if (remaining.length === 1) {
        setFinished(true);
      }
    } else {
      setWrong(id);

      setTimeout(() => {
        setWrong(null);
      }, 600);
    }
  };

  const restart = () => {
    setRemaining(items);
    setScore(0);
    setTime(60);
    setFinished(false);
  };

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={{ fontSize: 70 }}>🎉</div>

          <h1>Excellent!</h1>

          <p>You completed Drag & Drop Sorting.</p>

          <div style={styles.scoreBox}>
            ⭐ Score
            <strong>{score}</strong>
          </div>

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

          <h2>🧩 Drag & Drop Sorting</h2>

          <div style={styles.score}>
            ⭐ {score}
          </div>
        </div>

        <div style={styles.topInfo}>
          <span>Drag each object into the correct group</span>

          <strong>⏱️ {time}s</strong>
        </div>

        <div style={styles.progressBackground}>
          <div
            style={{
              ...styles.progress,
              width: `${((items.length - remaining.length) / items.length) * 100}%`,
            }}
          />
        </div>

        {/* ITEMS */}
        <div style={styles.itemsBox}>
          {remaining.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("id", String(item.id));
              }}
              style={{
                ...styles.item,
                transform:
                  wrong === item.id
                    ? "translateX(8px)"
                    : "none",
              }}
            >
              {item.name}
            </div>
          ))}

          {remaining.length === 0 && (
            <p>All objects sorted! 🎉</p>
          )}
        </div>

        {/* DROP AREAS */}
        <div style={styles.categories}>
          {categories.map((category) => (
            <div
              key={category}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, category)}
              style={styles.dropZone}
            >
              <div style={{ fontSize: 35 }}>
                {category === "Fruits"
                  ? "🍎"
                  : category === "Vehicles"
                  ? "🚗"
                  : "🐶"}
              </div>

              <h3>{category}</h3>

              <p>Drop items here</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#EEF5FF",
    fontFamily: "Poppins, sans-serif",
    padding: "30px",
  },

  container: {
    maxWidth: "1000px",
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

  topInfo: {
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
  },

  progress: {
    height: "100%",
    background: "#27AE60",
    transition: ".3s",
  },

  itemsBox: {
    background: "#fff",
    minHeight: "130px",
    marginTop: "25px",
    padding: "20px",
    borderRadius: "25px",
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,.07)",
  },

  item: {
    background: "#E3F2FD",
    border: "2px solid #90CAF9",
    borderRadius: "15px",
    padding: "15px 22px",
    cursor: "grab",
    fontWeight: 600,
    color: "#16324F",
    transition: ".2s",
  },

  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginTop: "25px",
  },

  dropZone: {
    minHeight: "220px",
    border: "3px dashed #90A4AE",
    borderRadius: "25px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#546E7A",
  },

  resultCard: {
    background: "#fff",
    maxWidth: "500px",
    margin: "150px auto",
    padding: "45px",
    borderRadius: "30px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,.1)",
  },

  scoreBox: {
    background: "#E8F5E9",
    padding: "20px",
    borderRadius: "20px",
    margin: "25px 0",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  primaryButton: {
    display: "block",
    width: "100%",
    padding: "14px",
    background: "#1565C0",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    marginBottom: "10px",
  },

  secondaryButton: {
    width: "100%",
    padding: "14px",
    background: "#E3F2FD",
    color: "#1565C0",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
  },
};