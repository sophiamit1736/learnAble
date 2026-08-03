import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, TopBar } from "./DashboardPage";

const P = "Poppins, sans-serif";
const primary = "#1565C0";
const accent = "#27ae60";
const muted = "#4A6580";
const dark = "#0D2137";

/* ─── Types ─── */
interface UserToggle {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
}

/* ─── KPI Card ─── */
function KpiCard({
  icon,
  label,
  value,
  color,
  live,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  live?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "24px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="material-icons-round" style={{ fontSize: 22, color }}>
            {icon}
          </span>
        </div>
        {live && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#27ae60",
                boxShadow: "0 0 0 3px rgba(39,174,96,0.3)",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: "#27ae60" }}>Live</span>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontFamily: P, fontSize: 28, fontWeight: 700, color: dark }}>{value}</div>
        <div style={{ fontFamily: P, fontSize: 13, color: muted, fontWeight: 500 }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ─── Avatar ─── */
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = [primary, accent, "#8e44ad", "#e67e22", "#e74c3c"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors[idx],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: P, fontWeight: 700, fontSize: size * 0.38, color: "#fff" }}>{initials}</span>
    </div>
  );
}

/* ─── Status Badge ─── */
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: P,
        fontSize: 11,
        fontWeight: 600,
        color,
        background: color + "18",
        borderRadius: 20,
        padding: "2px 10px",
      }}
    >
      {label}
    </span>
  );
}

/* ─── Manage Card ─── */
function ManageCard({
  icon,
  title,
  count,
  items,
  color,
  onAdd,
}: {
  icon: string;
  title: string;
  count: number;
  items: { name: string; sub: string; status: "Active" | "Inactive" }[];
  color: string;
  onAdd?: () => void;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: color + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-icons-round" style={{ fontSize: 20, color }}>{icon}</span>
          </div>
          <div>
            <div style={{ fontFamily: P, fontWeight: 700, fontSize: 15, color: dark }}>{title}</div>
            <div style={{ fontFamily: P, fontSize: 12, color: muted }}>{count} total</div>
          </div>
        </div>
        <Link to="#" style={{ textDecoration: "none", fontFamily: P, fontSize: 12, color: primary, fontWeight: 600 }}>
          View All
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto" }}>
        {items.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={item.name} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
              <div style={{ fontFamily: P, fontSize: 11, color: muted }}>{item.sub}</div>
            </div>
            <Badge label={item.status} color={item.status === "Active" ? accent : muted} />
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        style={{
          background: "linear-gradient(135deg,#1565C0,#27ae60)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "10px 0",
          fontFamily: P,
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span className="material-icons-round" style={{ fontSize: 16 }}>add</span>
        Add New
      </button>
    </div>
  );
}

/* ─── Toggle Switch ─── */
function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="toggle"
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: on ? primary : "#d1d5db",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 20 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}

/* ─── Main Component ─── */
export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"All Users" | "Teachers" | "Students" | "Admins">("All Users");

  const [users, setUsers] = useState<UserToggle[]>([
    { id: 1, name: "Priya Rajan", email: "priya@giid.edu", role: "Teacher", enabled: true },
    { id: 2, name: "Arun Kumar", email: "arun@giid.edu", role: "Teacher", enabled: true },
    { id: 3, name: "Meena Devi", email: "meena@giid.edu", role: "Student", enabled: false },
    { id: 4, name: "Suresh V", email: "suresh@giid.edu", role: "Admin", enabled: true },
    { id: 5, name: "Kavitha N", email: "kavitha@giid.edu", role: "Student", enabled: true },
    { id: 6, name: "Raj Mohan", email: "raj@giid.edu", role: "Teacher", enabled: false },
  ]);

  const tabs = ["All Users", "Teachers", "Students", "Admins"] as const;

  const filteredUsers = users.filter((u) => {
    if (activeTab === "All Users") return true;
    if (activeTab === "Admins") return u.role === "Admin";
    return u.role === activeTab.slice(0, -1); // Teachers -> Teacher
  });

  const toggleUser = (id: number) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)));

  const teachers = [
    { name: "Priya Rajan", sub: "Special Education", status: "Active" as const },
    { name: "Arun Kumar", sub: "Speech Therapy", status: "Active" as const },
    { name: "Lalitha S", sub: "Occupational Therapy", status: "Inactive" as const },
    { name: "Deepa M", sub: "Behavioural Therapy", status: "Active" as const },
  ];

  const students = [
    { name: "Karthik R", sub: "Age 8 · Class A", status: "Active" as const },
    { name: "Sindhu P", sub: "Age 10 · Class B", status: "Active" as const },
    { name: "Hari Shankar", sub: "Age 6 · Class A", status: "Inactive" as const },
    { name: "Nandha K", sub: "Age 12 · Class C", status: "Active" as const },
  ];

  const activities = [
    { name: "Animal Flashcards", sub: "Flashcard · Easy", status: "Active" as const },
    { name: "Colour Quiz", sub: "Quiz · Medium", status: "Active" as const },
    { name: "Number Matching", sub: "Game · Easy", status: "Active" as const },
    { name: "Shape Story", sub: "Story · Hard", status: "Inactive" as const },
  ];

  const logins = [
    { name: "Priya Rajan", role: "Teacher", time: "Today 09:14 AM", ip: "192.168.1.10", online: true },
    { name: "Arun Kumar", role: "Teacher", time: "Today 08:52 AM", ip: "192.168.1.14", online: true },
    { name: "Suresh V", role: "Admin", time: "Today 08:30 AM", ip: "192.168.1.2", online: true },
    { name: "Deepa M", role: "Teacher", time: "Yesterday 04:20 PM", ip: "192.168.1.19", online: false },
    { name: "Lalitha S", role: "Teacher", time: "Yesterday 02:05 PM", ip: "192.168.1.22", online: false },
  ];

  const settingLinks = [
    { icon: "palette", label: "Theme", desc: "Customize colors and appearance", to: "/settings" },
    { icon: "language", label: "Language", desc: "Set language and region", to: "/settings" },
    { icon: "notifications", label: "Notifications", desc: "Manage alert preferences", to: "/settings" },
    { icon: "backup", label: "Backup", desc: "Export and backup data", to: "/settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F4F8" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(39,174,96,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(39,174,96,0.1); }
        }
      `}</style>
      <Sidebar active="Admin" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <TopBar title="Admin Dashboard" subtitle="Platform administration and management" />

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Row 1 — KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            <KpiCard icon="school" label="Total Teachers" value={12} color={primary} />
            <KpiCard icon="people" label="Total Students" value={148} color={accent} />
            <KpiCard icon="play_circle" label="Active Sessions" value={7} color="#e67e22" live />
            <KpiCard icon="verified" label="Platform Uptime" value="99.8%" color="#8e44ad" />
          </div>

          {/* Row 2 — Manage */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            <ManageCard icon="school" title="Teachers" count={12} items={teachers} color={primary} onAdd={() => navigate("/add-student")} />
            <ManageCard icon="people" title="Students" count={148} items={students} color={accent} onAdd={() => navigate("/add-student")} />
            <ManageCard icon="extension" title="Activities" count={24} items={activities} color="#8e44ad" />
          </div>

          {/* Row 3 — Logins + User Management */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Recent Logins */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: P, fontWeight: 700, fontSize: 16, color: dark, marginBottom: 20 }}>Recent Logins</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Teacher", "Role", "Login Time", "IP Address", "Status"].map((h) => (
                      <th key={h} style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: muted, textAlign: "left", paddingBottom: 10, borderBottom: "1px solid #f0f0f0", letterSpacing: "0.04em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logins.map((row) => (
                    <tr key={row.name}>
                      <td style={{ padding: "12px 0 0 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar name={row.name} size={28} />
                          <span style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: dark }}>{row.name}</span>
                        </div>
                      </td>
                      <td style={{ paddingTop: 12 }}>
                        <span style={{ fontFamily: P, fontSize: 12, color: muted }}>{row.role}</span>
                      </td>
                      <td style={{ paddingTop: 12 }}>
                        <span style={{ fontFamily: P, fontSize: 12, color: muted }}>{row.time}</span>
                      </td>
                      <td style={{ paddingTop: 12 }}>
                        <span style={{ fontFamily: P, fontSize: 12, color: muted, fontVariantNumeric: "tabular-nums" }}>{row.ip}</span>
                      </td>
                      <td style={{ paddingTop: 12 }}>
                        <Badge label={row.online ? "Online" : "Offline"} color={row.online ? accent : muted} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* User Management */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: P, fontWeight: 700, fontSize: 16, color: dark, marginBottom: 16 }}>User Management</div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      fontFamily: P,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "none",
                      cursor: "pointer",
                      background: activeTab === tab ? primary : "#F0F4F8",
                      color: activeTab === tab ? "#fff" : muted,
                      transition: "all 0.15s",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <AnimatePresence mode="wait">
                  {filteredUsers.map((u) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Avatar name={u.name} size={34} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: dark }}>{u.name}</div>
                        <div style={{ fontFamily: P, fontSize: 11, color: muted }}>{u.email}</div>
                      </div>
                      <Badge
                        label={u.role}
                        color={u.role === "Admin" ? "#8e44ad" : u.role === "Teacher" ? primary : accent}
                      />
                      <ToggleSwitch on={u.enabled} onToggle={() => toggleUser(u.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Row 4 — Platform Settings */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {settingLinks.map(({ icon, label, desc, to }) => (
              <Link key={label} to={to} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: primary + "12",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-icons-round" style={{ fontSize: 22, color: primary }}>{icon}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: dark }}>{label}</div>
                    <div style={{ fontFamily: P, fontSize: 12, color: muted, marginTop: 2 }}>{desc}</div>
                  </div>
                  <span style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: primary }}>Configure →</span>
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
