import { motion } from "motion/react";
import { Link } from "react-router";
import { Sidebar, TopBar } from "./DashboardPage";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const P = "Poppins, sans-serif";
const PRIMARY = "#1565C0";
const ACCENT = "#27ae60";
const MUTED = "#4A6580";
const DARK = "#0D2137";

// ─── KPI Sparkline Data ───────────────────────────────────────────────────────
const apiSparkData = [70, 73, 72, 75, 76, 78];
const bpiSparkData = [76, 78, 79, 80, 81, 82];
const alpiSparkData = [68, 70, 72, 73, 75, 76];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return (
          <circle key={i} cx={x} cy={y} r={2.5} fill={color} />
        );
      })}
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  trend,
  color,
  sparkData,
  prominent,
}: {
  label: string;
  value: number;
  trend: string;
  color: string;
  sparkData: number[];
  prominent?: boolean;
}) {
  const positive = trend.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        fontFamily: P,
        background: "#fff",
        borderRadius: 20,
        padding: "28px 28px 22px",
        border: prominent
          ? `2px solid transparent`
          : "1px solid rgba(21,101,192,0.08)",
        boxShadow: prominent
          ? "0 4px 24px rgba(21,101,192,0.13)"
          : "0 2px 8px rgba(21,101,192,0.06)",
        backgroundImage: prominent
          ? `linear-gradient(white, white), linear-gradient(135deg, ${PRIMARY}, #7c3aed)`
          : undefined,
        backgroundOrigin: prominent ? "border-box" : undefined,
        backgroundClip: prominent ? "padding-box, border-box" : undefined,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {prominent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: "linear-gradient(135deg, rgba(124,58,237,0.07), transparent)",
            borderRadius: "0 0 0 120px",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: MUTED, letterSpacing: 0.3 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: positive ? ACCENT : "#e53935",
            background: positive ? "rgba(39,174,96,0.1)" : "rgba(229,57,53,0.1)",
            borderRadius: 20,
            padding: "3px 9px",
          }}
        >
          {positive ? "▲" : "▼"} {trend}
        </span>
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: color, lineHeight: 1 }}>
        {value.toFixed(1)}
      </div>
      <Sparkline data={sparkData} color={color} />
    </motion.div>
  );
}

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function CircleRing({ value, color }: { value: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={68} height={68} viewBox="0 0 68 68">
      <circle cx={34} cy={34} r={r} fill="none" stroke="#e8f0fe" strokeWidth={6} />
      <circle
        cx={34}
        cy={34}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 34 34)"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x={34}
        y={38}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill={color}
        fontFamily={P}
      >
        {value}
      </text>
    </svg>
  );
}

// ─── Student Progress Card ────────────────────────────────────────────────────
const STUDENTS = [
  { name: "Aarav", initials: "AA", score: 82, trend: 4, level: "Level 3" },
  { name: "Priya", initials: "PR", score: 74, trend: 2, level: "Level 2" },
  { name: "Ravi", initials: "RV", score: 91, trend: 6, level: "Level 4" },
  { name: "Sneha", initials: "SN", score: 67, trend: -1, level: "Level 2" },
  { name: "Kiran", initials: "KR", score: 88, trend: 3, level: "Level 3" },
  { name: "Meena", initials: "ME", score: 79, trend: 5, level: "Level 3" },
];

const RING_COLORS = [PRIMARY, ACCENT, "#7c3aed", "#e53935", "#0097a7", "#f57c00"];

function StudentCard({ s, color }: { s: typeof STUDENTS[0]; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(21,101,192,0.14)" }}
      style={{
        fontFamily: P,
        background: "#fff",
        borderRadius: 16,
        padding: "20px 18px",
        border: "1px solid rgba(21,101,192,0.09)",
        boxShadow: "0 2px 8px rgba(21,101,192,0.06)",
        minWidth: 155,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: `${color}1a`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color,
        }}
      >
        {s.initials}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{s.name}</div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color,
            background: `${color}15`,
            borderRadius: 20,
            padding: "2px 8px",
          }}
        >
          {s.level}
        </span>
      </div>
      <CircleRing value={s.score} color={color} />
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: s.trend >= 0 ? ACCENT : "#e53935",
        }}
      >
        {s.trend >= 0 ? "▲" : "▼"} {Math.abs(s.trend)} this week
      </div>
    </motion.div>
  );
}

// ─── Radar Data ───────────────────────────────────────────────────────────────
const radarData = [
  { subject: "Shape Skills", current: 80, prev: 65 },
  { subject: "Colour Recog.", current: 72, prev: 60 },
  { subject: "Letter Know.", current: 68, prev: 55 },
  { subject: "Number Skills", current: 75, prev: 68 },
  { subject: "Motor Skills", current: 85, prev: 78 },
  { subject: "Social Skills", current: 70, prev: 62 },
];

// ─── Pie Data ─────────────────────────────────────────────────────────────────
const pieData = [
  { name: "Shape Matching", value: 28 },
  { name: "Colour Matching", value: 18 },
  { name: "Animal Matching", value: 15 },
  { name: "Alphabet", value: 14 },
  { name: "Others", value: 25 },
];
const PIE_COLORS = [PRIMARY, ACCENT, "#FFA726", "#AB47BC", "#90a4b8"];

// ─── Line Chart Data ──────────────────────────────────────────────────────────
const timelineData = [
  { week: "W1", ALPI: 62, API: 70, BPI: 75 },
  { week: "W2", ALPI: 65, API: 72, BPI: 77 },
  { week: "W3", ALPI: 68, API: 74, BPI: 79 },
  { week: "W4", ALPI: 71, API: 76, BPI: 80 },
  { week: "W5", ALPI: 69, API: 75, BPI: 78 },
  { week: "W6", ALPI: 74, API: 78, BPI: 82 },
  { week: "W7", ALPI: 76, API: 80, BPI: 83 },
  { week: "W8", ALPI: 78, API: 82, BPI: 84 },
];

// ─── Monthly Progress Table ───────────────────────────────────────────────────
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const tableData = [
  { name: "Aarav",  scores: [70, 72, 74, 76, 78, 80, 82] },
  { name: "Priya",  scores: [65, 66, 68, 70, 71, 72, 74] },
  { name: "Ravi",   scores: [80, 82, 84, 86, 88, 89, 91] },
  { name: "Sneha",  scores: [60, 62, 63, 65, 66, 67, 67] },
  { name: "Kiran",  scores: [75, 77, 79, 82, 84, 86, 88] },
  { name: "Meena",  scores: [68, 70, 72, 74, 76, 77, 79] },
];

function cellColor(v: number) {
  if (v >= 80) return { bg: "rgba(39,174,96,0.12)", color: "#1b7a45" };
  if (v >= 70) return { bg: "rgba(255,167,38,0.12)", color: "#b05e00" };
  return { bg: "rgba(229,57,53,0.10)", color: "#b71c1c" };
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  padding: "24px 24px",
  border: "1px solid rgba(21,101,192,0.08)",
  boxShadow: "0 2px 8px rgba(21,101,192,0.06)",
};

export default function ALPIDashboardPage() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: P, background: "#f4f7fb" }}>
      <Sidebar active="Analytics" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title="Learning Analytics" subtitle="Adaptive Learning Performance Index — ALPI Dashboard" />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px 40px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Row 1 — KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <KpiCard label="Academic Performance Index (API)" value={78.4} trend="+5.2%" color={PRIMARY} sparkData={apiSparkData} />
            <KpiCard label="Behaviour Performance Index (BPI)" value={82.1} trend="+3.1%" color={ACCENT} sparkData={bpiSparkData} />
            <KpiCard label="Adaptive Learning Performance Index (ALPI)" value={76.4} trend="+4.8%" color="#7c3aed" sparkData={alpiSparkData} prominent />
          </div>

          {/* Row 2 — Student Progress Cards */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 14 }}>
              Student Progress
            </div>
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
              {STUDENTS.map((s, i) => (
                <StudentCard key={s.name} s={s} color={RING_COLORS[i]} />
              ))}
            </div>
          </div>

          {/* Row 3 — Radar + Pie */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Radar */}
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
                Skill Domain Radar
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(21,101,192,0.12)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: MUTED, fontFamily: P }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: MUTED }} />
                  <Radar name="Current Month" dataKey="current" stroke={PRIMARY} fill={PRIMARY} fillOpacity={0.25} strokeWidth={2} />
                  <Radar name="Previous Month" dataKey="prev" stroke={ACCENT} fill={ACCENT} fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 3" />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: P }} />
                  <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 10 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie */}
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
                Activity Distribution
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 10 }} formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 12 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: MUTED }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block" }} />
                    {d.name} ({d.value}%)
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4 — Timeline Line Chart */}
          <div style={cardStyle}>
            <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
              Activity Performance Timeline — 8-Week View
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timelineData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,101,192,0.08)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: MUTED, fontFamily: P }} />
                <YAxis domain={[55, 90]} tick={{ fontSize: 11, fill: MUTED, fontFamily: P }} />
                <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: P }} />
                <Line type="monotone" dataKey="ALPI" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="API" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 4, fill: PRIMARY }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="BPI" stroke={ACCENT} strokeWidth={2.5} dot={{ r: 4, fill: ACCENT }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Row 5 — Monthly Progress Table */}
          <div style={cardStyle}>
            <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
              Monthly ALPI Progress
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: P, fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: "1px solid rgba(21,101,192,0.1)" }}>
                      Student
                    </th>
                    {months.map(m => (
                      <th key={m} style={{ padding: "10px 14px", color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: "1px solid rgba(21,101,192,0.1)", textAlign: "center" }}>
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, ri) => (
                    <tr key={row.name} style={{ background: ri % 2 === 0 ? "#fff" : "#f8fafd" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: DARK }}>
                        {row.name}
                      </td>
                      {row.scores.map((sc, ci) => {
                        const cc = cellColor(sc);
                        return (
                          <td key={ci} style={{ padding: "8px 14px", textAlign: "center" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "3px 12px",
                              borderRadius: 20,
                              background: cc.bg,
                              color: cc.color,
                              fontWeight: 700,
                              fontSize: 12,
                            }}>
                              {sc}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
