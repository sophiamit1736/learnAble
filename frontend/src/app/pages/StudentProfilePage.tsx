import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import API from "../api/studentApi";
import axios from "axios";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Sidebar, TopBar } from "./DashboardPage";

const P = "Poppins, sans-serif";

const weeklyProgress = [
  { week: "W1", alpi: 62, activities: 8 },
  { week: "W2", alpi: 67, activities: 11 },
  { week: "W3", alpi: 71, activities: 10 },
  { week: "W4", alpi: 74, activities: 13 },
];

const monthlyProgress = [
  { month: "Mar", alpi: 58 },
  { month: "Apr", alpi: 63 },
  { month: "May", alpi: 68 },
  { month: "Jun", alpi: 74 },
  { month: "Jul", alpi: 82 },
];

const activityHistory = [
  { activity: "Shape Matching", date: "28 Jul 2025", score: "9/10", duration: "12 min", status: "Completed" },
  { activity: "Colour Matching", date: "27 Jul 2025", score: "8/10", duration: "10 min", status: "Completed" },
  { activity: "Animal Matching", date: "25 Jul 2025", score: "10/10", duration: "14 min", status: "Completed" },
  { activity: "Alphabet Matching", date: "23 Jul 2025", score: "7/10", duration: "11 min", status: "Completed" },
  { activity: "Fruit Matching", date: "21 Jul 2025", score: "9/10", duration: "13 min", status: "Completed" },
];

const notes = [
  { date: "28 Jul 2025", author: "Ms. Sridevi R.", note: "Aarav showed excellent shape recognition today. Responded well to visual cues. Recommend advancing to Level 3 activities next week." },
  { date: "21 Jul 2025", author: "Ms. Sridevi R.", note: "Slightly distracted during afternoon session. Completed all tasks with prompting. Morning sessions remain most productive." },
  { date: "14 Jul 2025", author: "Ms. Preethi K.", note: "Good participation in group activity. Made eye contact and followed turn-taking cues appropriately." },
];

function StatCard({ label, value, icon, color, bg, sub }: { label: string; value: string; icon: string; color: string; bg: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 12px rgba(21,101,192,0.07)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 38, height: 38, background: bg }}>
          <span className="material-icons-round" style={{ fontSize: 20, color }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontFamily: P, fontWeight: 700, fontSize: 24, color: "#0D2137" }}>{value}</div>
      <div style={{ fontFamily: P, fontWeight: 500, fontSize: 12, color: "#0D2137" }}>{label}</div>
      {sub && <div style={{ fontFamily: P, fontWeight: 400, fontSize: 11, color: "#4A6580" }}>{sub}</div>}
    </div>
  );
}

function ProgressRing({ value, color }: { value: number; color: string }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={104} height={104} viewBox="0 0 104 104">
      <circle cx={52} cy={52} r={r} fill="none" stroke="rgba(21,101,192,0.08)" strokeWidth={10} />
      <circle
        cx={52} cy={52} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 52 52)"
      />
      <text x={52} y={57} textAnchor="middle" fontFamily={P} fontWeight="700" fontSize="20" fill="#0D2137">{value}</text>
    </svg>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student,setStudent]=useState<any>(null);

  useEffect(()=>{

fetchStudent();

},[]);
const fetchStudent=async()=>{

const res=await API.get(`/${id}`);

setStudent(res.data);

}

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#F0F6FF" }}>
      <Sidebar active="Students" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Student Profile" subtitle="Detailed view of learning progress and history" />

        <main className="flex-1 p-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link to="/students" style={{ fontFamily: P, fontSize: 13, color: "#1565C0", textDecoration: "none" }}>Students</Link>
            <span className="material-icons-round" style={{ fontSize: 16, color: "#90a4b8" }}>chevron_right</span>
            <span style={{ fontFamily: P, fontSize: 13, color: "#4A6580" }}>{student.fullName}</span>
          </div>

          {/* Profile hero card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl overflow-hidden"
            style={{ background: "#fff", boxShadow: "0 4px 24px rgba(21,101,192,0.10)", border: "1.5px solid rgba(21,101,192,0.08)" }}
          >
            {/* Banner */}
            <div className="h-28" style={{ background: "linear-gradient(135deg,#1565C0 0%,#0d9e6e 60%,#27ae60 100%)" }} />

            <div className="px-8 pb-7 flex items-end gap-6" style={{ marginTop: -48 }}>
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-2xl shadow-lg"
                style={{ width: 88, height: 88, background: student.bg, border: `4px solid #fff`, flexShrink: 0 }}
              >
                <span style={{ fontFamily: P, fontWeight: 800, fontSize: 28, color: student.color }}>{student.initials}</span>
              </div>

              <div className="flex-1 pt-12">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 style={{ fontFamily: P, fontWeight: 700, fontSize: 22, color: "#0D2137", lineHeight: 1.2 }}>{student.fullName}</h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span style={{ fontFamily: P, fontSize: 13, color: "#4A6580" }}>Age {new Date().getFullYear()-new Date(student.dateOfBirth).getFullYear()} · ID: STU-{String(id).padStart(4, "0")}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#FFF9C4", color: "#F9A825", fontFamily: P }}>Moderate</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#E8F5E9", color: "#27ae60", fontFamily: P }}>Active</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-12">
                    <Link to="/students/add">
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#E3F2FD", border: "none", fontFamily: P, fontSize: 13, fontWeight: 500, color: "#1565C0", cursor: "pointer" }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>edit</span>
                        Edit Profile
                      </button>
                    </Link>
                    <Link to={`/observation/${id}`}>
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#E8F5E9", border: "none", fontFamily: P, fontSize: 13, fontWeight: 500, color: "#27ae60", cursor: "pointer" }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>assignment</span>
                        Observe
                      </button>
                    </Link>
                    <Link to="/learn/shape-matching">
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,#1565C0,#27ae60)", border: "none", fontFamily: P, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(21,101,192,0.3)" }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>play_arrow</span>
                        Start Session
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Info strip */}
            <div className="grid grid-cols-4 border-t" style={{ borderColor: "rgba(21,101,192,0.08)" }}>
              {[
                { label: "Guardian", value: student.guardianName },
                { label: "Phone", value: student.guardianPhone },
                { label: "Joined", value: new Date(student.joinedDate).toLocaleDateString() },
                { label: "Total Sessions", value: `${student.sessions} sessions` },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-4 border-r last:border-r-0" style={{ borderColor: "rgba(21,101,192,0.08)" }}>
                  <div style={{ fontFamily: P, fontSize: 11, color: "#4A6580", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontFamily: P, fontWeight: 600, fontSize: 13, color: "#0D2137" }}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 flex flex-col items-center gap-2" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 12px rgba(21,101,192,0.07)" }}>
              <ProgressRing value={student.alpi} color="#1565C0" />
              <div style={{ fontFamily: P, fontWeight: 600, fontSize: 13, color: "#0D2137" }}>Current ALPI</div>
              <div style={{ fontFamily: P, fontSize: 11, color: "#4A6580" }}>+4.2 this month</div>
            </div>
            <StatCard label="facp Baseline" value={String(student.facpBaseline)} icon="assessment" color="#27ae60" bg="#E8F5E9" sub="Updated: July 2025" />
            <StatCard label="Activities Done" value="42" icon="check_circle" color="#AB47BC" bg="#F3E5F5" sub="This month: 14" />
            <StatCard label="Avg. Session Time" value="12 min" icon="schedule" color="#FF7043" bg="#FBE9E7" sub="Optimal range" />
          </div>

          {/* Charts row */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 12px rgba(21,101,192,0.07)" }}>
              <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137", marginBottom: 4 }}>Weekly Progress</div>
              <div style={{ fontFamily: P, fontSize: 12, color: "#4A6580", marginBottom: 16 }}>ALPI score per week (July 2025)</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyProgress} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,101,192,0.06)" />
                  <XAxis dataKey="week" tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 12 }} />
                  <Bar dataKey="alpi" fill="#1565C0" radius={[8, 8, 0, 0]} name="ALPI Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 12px rgba(21,101,192,0.07)" }}>
              <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137", marginBottom: 4 }}>Monthly Progress</div>
              <div style={{ fontFamily: P, fontSize: 12, color: "#4A6580", marginBottom: 16 }}>ALPI trend over past 5 months</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,101,192,0.06)" />
                  <XAxis dataKey="month" tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontFamily: P, fontSize: 11, fill: "#4A6580" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: P, fontSize: 12, borderRadius: 12 }} />
                  <Line type="monotone" dataKey="alpi" stroke="#27ae60" strokeWidth={3} dot={{ fill: "#27ae60", r: 5 }} name="ALPI Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity history + Teacher notes */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "3fr 2fr" }}>
            {/* Activity history */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 12px rgba(21,101,192,0.07)" }}>
              <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137", marginBottom: 16 }}>Activity History</div>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid rgba(21,101,192,0.08)" }}>
                    {["Activity", "Date", "Score", "Duration", "Status"].map(h => (
                      <th key={h} style={{ fontFamily: P, fontWeight: 600, fontSize: 11, color: "#4A6580", textAlign: "left", paddingBottom: 10, paddingRight: 12, letterSpacing: "0.04em" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activityHistory.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(21,101,192,0.05)" }}>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontWeight: 500, fontSize: 13, color: "#0D2137" }}>{row.activity}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontSize: 12, color: "#4A6580" }}>{row.date}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontWeight: 600, fontSize: 13, color: "#1565C0" }}>{row.score}</td>
                      <td className="py-3 pr-3" style={{ fontFamily: P, fontSize: 12, color: "#4A6580" }}>{row.duration}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#E8F5E9", color: "#27ae60", fontFamily: P }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Teacher notes */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 12px rgba(21,101,192,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137" }}>Teacher Notes</div>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ background: "#E3F2FD", border: "none", fontFamily: P, fontSize: 12, fontWeight: 500, color: "#1565C0", cursor: "pointer" }}>
                  <span className="material-icons-round" style={{ fontSize: 15 }}>add</span>
                  Add Note
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {notes.map((n, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: "#F8FAFF", border: "1px solid rgba(21,101,192,0.08)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "linear-gradient(135deg,#1565C0,#27ae60)" }}>
                        <span style={{ fontFamily: P, fontWeight: 700, fontSize: 10, color: "#fff" }}>SR</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: P, fontWeight: 600, fontSize: 12, color: "#0D2137" }}>{n.author}</div>
                        <div style={{ fontFamily: P, fontSize: 10, color: "#4A6580" }}>{n.date}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: P, fontWeight: 400, fontSize: 12, color: "#4A6580", lineHeight: 1.6 }}>{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
