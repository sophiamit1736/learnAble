import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "motion/react";

const P = "Poppins, sans-serif";

/* ─── Shared sidebar nav ─── */
export function Sidebar({ active }: { active: string }) {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const nav = [
    {
      label: "Dashboard",
      icon: "dashboard",
      to: "/dashboard",
    },
    {
      label: "Students",
      icon: "people",
      to: "/students",
    },
    {
      label: "Activities",
      icon: "extension",
      to: "/activities",
    },
    {
      label: "Analytics",
      icon: "bar_chart",
      to: "/analytics",
    },
    {
      label: "Reports",
      icon: "description",
      to: "/reports",
    },
    {
      label: "AI Generator",
      icon: "auto_awesome",
      to: "/ai-generator",
    },
    ...(user.role === "admin"
      ? [
          {
            label: "Admin",
            icon: "admin_panel_settings",
            to: "/admin",
          },
        ]
      : []),
    {
      label: "Settings",
      icon: "settings",
      to: "/settings",
    },
  ];

  return (
    <aside
      className="flex flex-col h-screen sticky top-0"
      style={{
        width: 240,
        background: "#0D2137",
        minHeight: "100vh",
        flexShrink: 0,
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <div
          className="flex items-center gap-3 px-6 py-5 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg,#1565C0,#27ae60)",
            }}
          >
            <span
              style={{
                fontFamily: P,
                fontWeight: 800,
                fontSize: 16,
                color: "#fff",
              }}
            >
              G
            </span>
          </div>

          <div>
            <div
              style={{
                fontFamily: P,
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
              }}
            >
              GIID
            </div>

            <div
              style={{
                fontFamily: P,
                fontWeight: 400,
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              TAMBARAM
            </div>
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">

        <div
          style={{
            fontFamily: P,
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            paddingLeft: 12,
            marginBottom: 6,
          }}
        >
          MAIN MENU
        </div>

        {nav.map(({ label, icon, to }) => {

          const isActive = active === label;

          return (
            <Link
              key={label}
              to={to}
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg,rgba(21,101,192,0.6),rgba(13,158,110,0.4))"
                    : "transparent",
                }}
              >
                <span
                  className="material-icons-round"
                  style={{
                    color: isActive
                      ? "#fff"
                      : "rgba(255,255,255,0.5)",
                  }}
                >
                  {icon}
                </span>

                <span
                  style={{
                    color: isActive
                      ? "#fff"
                      : "rgba(255,255,255,0.6)",
                    fontFamily: P,
                  }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div
        className="px-3 pb-6 border-t pt-4"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl w-full"
          style={{
            background: "transparent",
            color: "#ff7b7b",
            border: "none",
            cursor: "pointer",
            fontFamily: P,
          }}
        >
          <span className="material-icons-round">
            logout
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
}

/* ─── Top bar ─── */
export function TopBar({
  title,
  subtitle,
  user,
}: {
  title: string;
  subtitle?: string;
  user?: { name: string; role: string };
}) {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();
  const currentUser = user || storedUser || { name: "User", role: "teacher" };

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GI";

  return (
    <header
      className="flex items-center gap-4 px-8 py-4 border-b"
      style={{
        background: "#fff",
        borderColor: "rgba(21,101,192,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Title */}
      <div className="flex-1">
        <h1
          style={{
            fontFamily: P,
            fontWeight: 700,
            fontSize: 20,
            color: "#0D2137",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: P,
            fontWeight: 400,
            fontSize: 13,
            color: "#4A6580",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: "#F0F6FF",
          border: "1.5px solid rgba(21,101,192,0.14)",
          width: 240,
        }}
      >
        <span
          className="material-icons-round"
          style={{ fontSize: 18, color: "#90a4b8" }}
        >
          search
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none flex-1"
          style={{
            fontFamily: P,
            fontSize: 13,
            color: "#0D2137",
          }}
        />
      </div>

      {/* Notification */}
      <button
        className="relative flex items-center justify-center rounded-xl"
        style={{
          width: 40,
          height: 40,
          background: "#F0F6FF",
          border: "1.5px solid rgba(21,101,192,0.14)",
          cursor: "pointer",
        }}
      >
        <span
          className="material-icons-round"
          style={{
            fontSize: 20,
            color: "#1565C0",
          }}
        >
          notifications
        </span>

        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ background: "#EF5350" }}
        />
      </button>

      {/* Logged-in Teacher/Admin Profile */}
      <div style={{ position: "relative" }}>
      <button
        onClick={() => setProfileOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: "#F0F6FF", border: "1.5px solid rgba(21,101,192,0.14)", cursor: "pointer" }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            background:
              "linear-gradient(135deg,#1565C0,#27ae60)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {initials}
        </div>

        <div>
          <div
            style={{
              fontFamily: P,
              fontWeight: 600,
              fontSize: 13,
              color: "#0D2137",
            }}
          >
            {currentUser?.name || "User"}
          </div>

          <div
            style={{
              fontFamily: P,
              fontSize: 11,
              color: "#4A6580",
            }}
          >
            {currentUser?.role || "teacher"}
          </div>
        </div>

        <span
          className="material-icons-round"
          style={{
            fontSize: 18,
            color: "#4A6580",
          }}
        >
          expand_more
        </span>
      </button>
      {profileOpen && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 210, background: "#fff", border: "1px solid rgba(21,101,192,0.12)", borderRadius: 14, boxShadow: "0 12px 30px rgba(13,33,55,.15)", padding: 8, zIndex: 100 }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #eef3f8" }}>
            <div style={{ fontFamily: P, fontWeight: 700, fontSize: 13, color: "#0D2137" }}>{currentUser?.name}</div>
            <div style={{ fontFamily: P, fontSize: 11, color: "#4A6580", textTransform: "capitalize" }}>{currentUser?.role}</div>
          </div>
          <button onClick={() => window.location.href = "/settings"} style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", padding: "10px 12px", cursor: "pointer", fontFamily: P, fontSize: 12, color: "#0D2137" }}>⚙️ Profile & Settings</button>
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }} style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", padding: "10px 12px", cursor: "pointer", fontFamily: P, fontSize: 12, color: "#d32f2f" }}>↪ Logout</button>
        </div>
      )}
      </div>
    </header>
  );
}

/* ─── Stat card ─── */
function StatCard({ icon, label, value, sub, color, bg }: { icon: string; label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{ background: "#fff", boxShadow: "0 2px 16px rgba(21,101,192,0.09)", border: "1.5px solid rgba(21,101,192,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: bg }}>
          <span className="material-icons-round" style={{ fontSize: 22, color }}>{icon}</span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: bg, color, fontFamily: P, fontWeight: 600 }}>+12%</span>
      </div>
      <div>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 28, color: "#0D2137", lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: P, fontWeight: 500, fontSize: 13, color: "#0D2137", marginTop: 4 }}>{label}</div>
        <div style={{ fontFamily: P, fontWeight: 400, fontSize: 11, color: "#4A6580", marginTop: 2 }}>{sub}</div>
      </div>
    </motion.div>
  );
}

/* ─── Data ─── */
const weeklyData = [
  { day: "Mon", alpi: 62, sessions: 8 },
  { day: "Tue", alpi: 68, sessions: 11 },
  { day: "Wed", alpi: 65, sessions: 9 },
  { day: "Thu", alpi: 74, sessions: 13 },
  { day: "Fri", alpi: 71, sessions: 12 },
  { day: "Sat", alpi: 78, sessions: 7 },
  { day: "Sun", alpi: 76, sessions: 5 },
];

const barData = [
  { name: "Aarav", score: 82 },
  { name: "Priya", score: 74 },
  { name: "Ravi", score: 91 },
  { name: "Sneha", score: 67 },
  { name: "Kiran", score: 88 },
  { name: "Meena", score: 79 },
];

const activities = [
  { student: "Aarav Kumar", activity: "Shape Matching", level: "Level 2", score: "9/10", time: "10:30 AM", status: "Completed" },
  { student: "Priya Sharma", activity: "Colour Matching", level: "Level 1", score: "7/10", time: "11:00 AM", status: "Completed" },
  { student: "Ravi Raj", activity: "Animal Matching", level: "Level 3", score: "10/10", time: "11:30 AM", status: "Completed" },
  { student: "Sneha Patel", activity: "Alphabet Matching", level: "Level 1", score: "6/10", time: "12:00 PM", status: "In Progress" },
  { student: "Kiran M.", activity: "Fruit Matching", level: "Level 2", score: "–", time: "2:00 PM", status: "Upcoming" },
];

const upcoming = [
  { title: "Shape Matching", students: 4, time: "2:00 PM", color: "#1565C0", bg: "#E3F2FD" },
  { title: "Colour Sorting", students: 3, time: "3:00 PM", color: "#27ae60", bg: "#E8F5E9" },
  { title: "Alphabet Quiz", students: 6, time: "4:00 PM", color: "#AB47BC", bg: "#F3E5F5" },
];

const statusColor: Record<string, { bg: string; color: string }> = {
  "Completed": { bg: "#E8F5E9", color: "#27ae60" },
  "In Progress": { bg: "#FFF9C4", color: "#F9A825" },
  "Upcoming": { bg: "#E3F2FD", color: "#1565C0" },
};

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#F0F6FF" }}>
      <Sidebar active="Dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        {/* <TopBar title="Dashboard" subtitle={`Welcome back, ${user.name || "User"}!`} /> */}
        <TopBar
            title="Teacher Dashboard"
            subtitle={`Welcome back, ${user.name || "Teacher"}`}
            user={user}
          />
        <main className="flex-1 p-8 flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-5">
            <StatCard icon="people" label="Total Students" value="24" sub="Active this week: 21" color="#1565C0" bg="#E3F2FD" />
            <StatCard icon="check_circle" label="Activities Completed" value="186" sub="This week: +34" color="#27ae60" bg="#E8F5E9" />
            <StatCard icon="auto_awesome" label="Average ALPI" value="76.4" sub="Improved by 3.2 pts" color="#AB47BC" bg="#F3E5F5" />
            <StatCard icon="today" label="Today's Sessions" value="8" sub="Next session: 2:00 PM" color="#FF7043" bg="#FBE9E7" />
          </div>

          {/* Charts row */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Line chart */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(21,101,192,0.09)", border: "1.5px solid rgba(21,101,192,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137" }}>Weekly Performance</div>
                  <div style={{ fontFamily: P, fontWeight: 400, fontSize: 12, color: "#4A6580" }}>ALPI score trend this week</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#E3F2FD", color: "#1565C0", fontFamily: P }}>This Week</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,101,192,0.06)" />
                  <XAxis dataKey="day" tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 12, border: "1px solid rgba(21,101,192,0.15)" }} />
                  <Line type="monotone" dataKey="alpi" stroke="#1565C0" strokeWidth={3} dot={{ fill: "#1565C0", r: 5 }} name="ALPI Score" />
                  <Line type="monotone" dataKey="sessions" stroke="#27ae60" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(21,101,192,0.09)", border: "1.5px solid rgba(21,101,192,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137" }}>Student Progress</div>
                  <div style={{ fontFamily: P, fontWeight: 400, fontSize: 12, color: "#4A6580" }}>ALPI scores by student</div>
                </div>
                <Link to="/students" style={{ textDecoration: "none" }}>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#E8F5E9", color: "#27ae60", fontFamily: P }}>View All →</span>
                </Link>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,101,192,0.06)" />
                  <XAxis dataKey="name" tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 12, border: "1px solid rgba(21,101,192,0.15)" }} />
                  <Bar dataKey="score" fill="#1565C0" radius={[8, 8, 0, 0]} name="ALPI Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
            {/* Recent activities table */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(21,101,192,0.09)", border: "1.5px solid rgba(21,101,192,0.08)" }}>
              <div className="flex items-center justify-between mb-5">
                <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137" }}>Recent Activities</div>
                <button style={{ fontFamily: P, fontWeight: 500, fontSize: 12, color: "#1565C0", background: "none", border: "none", cursor: "pointer" }}>View all</button>
              </div>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid rgba(21,101,192,0.08)" }}>
                    {["Student", "Activity", "Level", "Score", "Time", "Status"].map(h => (
                      <th key={h} style={{ fontFamily: P, fontWeight: 600, fontSize: 11, color: "#4A6580", textAlign: "left", paddingBottom: 10, paddingRight: 12, letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activities.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(21,101,192,0.05)" }}>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontWeight: 500, fontSize: 13, color: "#0D2137" }}>{row.student}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontSize: 13, color: "#4A6580" }}>{row.activity}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontSize: 12, color: "#4A6580" }}>{row.level}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontWeight: 600, fontSize: 13, color: "#0D2137" }}>{row.score}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontSize: 12, color: "#4A6580" }}>{row.time}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: statusColor[row.status].bg, color: statusColor[row.status].color, fontFamily: P }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Upcoming + Quick actions */}
            <div className="flex flex-col gap-5">
              {/* Upcoming */}
              <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(21,101,192,0.09)", border: "1.5px solid rgba(21,101,192,0.08)" }}>
                <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137", marginBottom: 16 }}>Upcoming Activities</div>
                <div className="flex flex-col gap-3">
                  {upcoming.map((u, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: u.bg }}>
                      <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: u.color }}>
                        <span className="material-icons-round text-white" style={{ fontSize: 18 }}>extension</span>
                      </div>
                      <div className="flex-1">
                        <div style={{ fontFamily: P, fontWeight: 600, fontSize: 13, color: "#0D2137" }}>{u.title}</div>
                        <div style={{ fontFamily: P, fontWeight: 400, fontSize: 11, color: "#4A6580" }}>{u.students} students · {u.time}</div>
                      </div>
                      <Link to="/learning">
                        <span className="material-icons-round" style={{ fontSize: 18, color: u.color, cursor: "pointer" }}>play_circle</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 16px rgba(21,101,192,0.09)", border: "1.5px solid rgba(21,101,192,0.08)" }}>
                <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137", marginBottom: 16 }}>Quick Actions</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "person_add", label: "Add Student", to: "/students/add", color: "#1565C0", bg: "#E3F2FD" },
                    { icon: "extension", label: "Activities", to: "/activities", color: "#27ae60", bg: "#E8F5E9" },
                    { icon: "people", label: "Students", to: "/students", color: "#AB47BC", bg: "#F3E5F5" },
                    { icon: "play_arrow", label: "Start Session", to: "/learn/shape-matching", color: "#FF7043", bg: "#FBE9E7" },
                  ].map(({ icon, label, to, color, bg }) => (
                    <Link key={label} to={to} style={{ textDecoration: "none" }}>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer"
                        style={{ background: bg, border: `1.5px solid ${color}22` }}
                      >
                        <span className="material-icons-round" style={{ fontSize: 24, color }}>{icon}</span>
                        <span style={{ fontFamily: P, fontWeight: 600, fontSize: 12, color: "#0D2137", textAlign: "center" }}>{label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
