import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, TopBar } from "./DashboardPage";

const P = "Poppins, sans-serif";
const primary = "#1565C0";
const accent = "#27ae60";
const muted = "#4A6580";
const dark = "#0D2137";

type Section =
  | "Profile"
  | "Password & Security"
  | "Appearance"
  | "Language & Region"
  | "Notifications"
  | "Data & Backup"
  | "Help & Support";

/* ─── Toggle Switch ─── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="toggle"
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
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
          top: 4,
          left: on ? 23 : 4,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

/* ─── Field ─── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: muted, letterSpacing: "0.03em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

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

/* ─── Save Button ─── */
function SaveBtn({ label = "Save Changes" }: { label?: string }) {
  return (
    <button
      style={{
        background: "linear-gradient(135deg,#1565C0,#27ae60)",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: "12px 28px",
        fontFamily: P,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(21,101,192,0.3)",
      }}
    >
      {label}
    </button>
  );
}

/* ─── Profile Panel ─── */
function ProfilePanel() {
  const [name, setName] = useState("Priya Rajan");
  const [email, setEmail] = useState("priya@giid.edu");
  const [empId, setEmpId] = useState("GIID-001");
  const [dept, setDept] = useState("Special Education");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Passionate special educator with 8+ years of experience.");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#1565C0,#27ae60)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: P, fontWeight: 800, fontSize: 28, color: "#fff" }}>PR</span>
        </div>
        <div>
          <div style={{ fontFamily: P, fontWeight: 700, fontSize: 16, color: dark }}>{name}</div>
          <div style={{ fontFamily: P, fontSize: 13, color: muted, marginBottom: 10 }}>{dept}</div>
          <button
            style={{
              fontFamily: P,
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: 20,
              border: `2px solid ${primary}`,
              background: "transparent",
              color: primary,
              cursor: "pointer",
            }}
          >
            Change Photo
          </button>
        </div>
      </div>

      {/* Form grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Field label="Full Name">
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Employee ID">
          <input style={inputStyle} value={empId} onChange={(e) => setEmpId(e.target.value)} />
        </Field>
        <Field label="Department">
          <input style={inputStyle} value={dept} onChange={(e) => setDept(e.target.value)} />
        </Field>
        <Field label="Phone">
          <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
      </div>
      <Field label="Bio">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
        />
      </Field>
      <div>
        <SaveBtn label="Save Profile" />
      </div>
    </div>
  );
}

/* ─── Password Panel ─── */
function PasswordPanel() {
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [conf, setConf] = useState("");

  const strength = nw.length === 0 ? 0 : nw.length < 6 ? 1 : nw.length <= 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Medium", "Strong"][strength];
  const strengthColor = ["", "#e74c3c", "#f39c12", accent][strength];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <Field label="Current Password">
        <input type="password" style={inputStyle} value={cur} onChange={(e) => setCur(e.target.value)} />
      </Field>
      <Field label="New Password">
        <input type="password" style={inputStyle} value={nw} onChange={(e) => setNw(e.target.value)} />
        {nw.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {[1, 2, 3].map((lvl) => (
                <div
                  key={lvl}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 4,
                    background: strength >= lvl ? strengthColor : "#e2e8f0",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
            <span style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: strengthColor }}>
              {strengthLabel}
            </span>
          </div>
        )}
      </Field>
      <Field label="Confirm New Password">
        <input type="password" style={inputStyle} value={conf} onChange={(e) => setConf(e.target.value)} />
      </Field>
      <div>
        <SaveBtn label="Change Password" />
      </div>
    </div>
  );
}

/* ─── Appearance Panel ─── */
function AppearancePanel() {
  const [theme, setTheme] = useState("Light");
  const [fontSize, setFontSize] = useState("Medium");
  const [accent2, setAccent2] = useState(primary);

  const themes = [
    {
      label: "Light",
      preview: (
        <div style={{ width: "100%", height: 56, borderRadius: 8, background: "#f8f9fa", border: "1px solid #e2e8f0", display: "flex", gap: 4, padding: 8, boxSizing: "border-box" }}>
          <div style={{ width: 20, height: "100%", borderRadius: 4, background: "#e2e8f0" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 8, borderRadius: 4, background: "#d1d5db", width: "70%" }} />
            <div style={{ height: 8, borderRadius: 4, background: "#e2e8f0", width: "50%" }} />
          </div>
        </div>
      ),
    },
    {
      label: "Dark",
      preview: (
        <div style={{ width: "100%", height: 56, borderRadius: 8, background: "#1e293b", border: "1px solid #334155", display: "flex", gap: 4, padding: 8, boxSizing: "border-box" }}>
          <div style={{ width: 20, height: "100%", borderRadius: 4, background: "#334155" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 8, borderRadius: 4, background: "#475569", width: "70%" }} />
            <div style={{ height: 8, borderRadius: 4, background: "#334155", width: "50%" }} />
          </div>
        </div>
      ),
    },
    {
      label: "System",
      preview: (
        <div style={{ width: "100%", height: 56, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0", display: "flex" }}>
          <div style={{ flex: 1, background: "#f8f9fa" }} />
          <div style={{ flex: 1, background: "#1e293b" }} />
        </div>
      ),
    },
  ];

  const swatches = [primary, accent, "#8e44ad", "#e67e22", "#e74c3c", "#00838f"];
  const fontSizes = ["Small", "Medium", "Large"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: dark, marginBottom: 14 }}>Theme</div>
        <div style={{ display: "flex", gap: 14 }}>
          {themes.map(({ label, preview }) => (
            <button
              key={label}
              onClick={() => setTheme(label)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 16,
                border: `2px solid ${theme === label ? primary : "#e2e8f0"}`,
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {preview}
              <span style={{ fontFamily: P, fontSize: 13, fontWeight: theme === label ? 700 : 500, color: theme === label ? primary : muted }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: dark, marginBottom: 14 }}>Font Size</div>
        <div style={{ display: "flex", gap: 8 }}>
          {fontSizes.map((f) => (
            <button
              key={f}
              onClick={() => setFontSize(f)}
              style={{
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 22px",
                borderRadius: 20,
                border: `2px solid ${fontSize === f ? primary : "#e2e8f0"}`,
                background: fontSize === f ? primary : "#fff",
                color: fontSize === f ? "#fff" : muted,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: dark, marginBottom: 14 }}>Accent Color</div>
        <div style={{ display: "flex", gap: 10 }}>
          {swatches.map((color) => (
            <button
              key={color}
              onClick={() => setAccent2(color)}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: color,
                border: `3px solid ${accent2 === color ? "#fff" : color}`,
                boxShadow: accent2 === color ? `0 0 0 3px ${color}` : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              {accent2 === color && (
                <span className="material-icons-round" style={{ fontSize: 18, color: "#fff" }}>check</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Language Panel ─── */
function LanguagePanel() {
  const [lang, setLang] = useState("English (US)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <Field label="Language">
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={inputStyle}>
          {["English (US)", "Tamil", "Hindi", "Telugu"].map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Field>
      <Field label="Region">
        <input style={inputStyle} value="India" readOnly />
      </Field>
      <Field label="Date Format">
        <div style={{ display: "flex", gap: 8 }}>
          {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((f) => (
            <button
              key={f}
              onClick={() => setDateFormat(f)}
              style={{
                fontFamily: P,
                fontSize: 12,
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: 20,
                border: `2px solid ${dateFormat === f ? primary : "#e2e8f0"}`,
                background: dateFormat === f ? primary : "#fff",
                color: dateFormat === f ? "#fff" : muted,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Time Format">
        <div style={{ display: "flex", gap: 8 }}>
          {["12h", "24h"].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFormat(f)}
              style={{
                fontFamily: P,
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 22px",
                borderRadius: 20,
                border: `2px solid ${timeFormat === f ? primary : "#e2e8f0"}`,
                background: timeFormat === f ? primary : "#fff",
                color: timeFormat === f ? "#fff" : muted,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </Field>
      <div>
        <SaveBtn label="Save Language Settings" />
      </div>
    </div>
  );
}

/* ─── Notifications Panel ─── */
function NotificationsPanel() {
  const [settings, setSettings] = useState([
    { label: "Email Notifications", desc: "Receive updates via email", on: true },
    { label: "Session Reminders", desc: "Reminders before student sessions", on: true },
    { label: "Weekly Reports", desc: "Weekly performance summaries", on: true },
    { label: "Achievement Alerts", desc: "Student milestone notifications", on: true },
    { label: "System Updates", desc: "Platform update announcements", on: false },
  ]);

  const toggle = (i: number) =>
    setSettings((s) => s.map((item, idx) => idx === i ? { ...item, on: !item.on } : item));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {settings.map((s, i) => (
        <div
          key={s.label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderRadius: 16,
            background: "#F8FAFC",
            border: "2px solid #e2e8f0",
          }}
        >
          <div>
            <div style={{ fontFamily: P, fontSize: 14, fontWeight: 600, color: dark }}>{s.label}</div>
            <div style={{ fontFamily: P, fontSize: 12, color: muted }}>{s.desc}</div>
          </div>
          <Toggle on={s.on} onToggle={() => toggle(i)} />
        </div>
      ))}
    </div>
  );
}

/* ─── Data & Backup Panel ─── */
function DataBackupPanel() {
  const [backingUp, setBackingUp] = useState(false);

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => setBackingUp(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "#F8FAFC",
          border: "2px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: dark }}>Last Backup</div>
          <div style={{ fontFamily: P, fontSize: 13, color: muted }}>28 Jul 2025, 11:00 PM</div>
        </div>
        <button
          onClick={handleBackup}
          style={{
            fontFamily: P,
            fontSize: 13,
            fontWeight: 700,
            padding: "10px 22px",
            borderRadius: 12,
            border: "none",
            background: backingUp ? "#94a3b8" : primary,
            color: "#fff",
            cursor: backingUp ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span className="material-icons-round" style={{ fontSize: 16 }}>
            {backingUp ? "hourglass_empty" : "backup"}
          </span>
          {backingUp ? "Backing up..." : "Backup Now"}
        </button>
      </div>

      <button
        style={{
          fontFamily: P,
          fontSize: 13,
          fontWeight: 700,
          padding: "12px 0",
          borderRadius: 14,
          border: `2px solid ${accent}`,
          background: accent + "10",
          color: accent,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span className="material-icons-round" style={{ fontSize: 18 }}>download</span>
        Export All Data (CSV)
      </button>

      {/* Danger Zone */}
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          border: "2px solid #fca5a5",
          background: "#fff5f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 20, color: "#e74c3c" }}>warning</span>
          <span style={{ fontFamily: P, fontWeight: 700, fontSize: 15, color: "#c0392b" }}>Danger Zone</span>
        </div>
        <div style={{ fontFamily: P, fontSize: 13, color: "#7f1d1d", marginBottom: 16 }}>
          Deleting your account is permanent and irreversible. All data will be lost.
        </div>
        <button
          style={{
            fontFamily: P,
            fontSize: 13,
            fontWeight: 700,
            padding: "10px 22px",
            borderRadius: 12,
            border: "2px solid #e74c3c",
            background: "transparent",
            color: "#e74c3c",
            cursor: "pointer",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* ─── Help Panel ─── */
function HelpPanel() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "How do I add a new student?",
      a: "Navigate to the Students section from the sidebar, then click the '+ Add Student' button to create a new student profile.",
    },
    {
      q: "Can I export student progress reports?",
      a: "Yes. Go to the student's profile page and click 'Export Report'. You can export as PDF or CSV for any date range.",
    },
    {
      q: "How do I reset a student's activity progress?",
      a: "Open the student profile, go to the Activities tab, and click 'Reset Progress' on any activity card.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* FAQ */}
      <div>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 15, color: dark, marginBottom: 14 }}>
          Frequently Asked Questions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderRadius: 14,
                border: "2px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 18px",
                  background: open === i ? primary + "08" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: dark }}>{faq.q}</span>
                <span className="material-icons-round" style={{ fontSize: 20, color: muted, flexShrink: 0 }}>
                  {open === i ? "expand_less" : "expand_more"}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "0 18px 14px", fontFamily: P, fontSize: 13, color: muted, lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "#F8FAFC",
          border: "2px solid #e2e8f0",
        }}
      >
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 14, color: dark, marginBottom: 12 }}>
          Contact Support
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-icons-round" style={{ fontSize: 18, color: primary }}>email</span>
            <span style={{ fontFamily: P, fontSize: 13, color: muted }}>support@giid.edu</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-icons-round" style={{ fontSize: 18, color: primary }}>phone</span>
            <span style={{ fontFamily: P, fontSize: 13, color: muted }}>+91 44 2233 4455</span>
          </div>
        </div>
      </div>

      {/* Version */}
      <div style={{ fontFamily: P, fontSize: 12, color: muted, display: "flex", alignItems: "center", gap: 6 }}>
        <span className="material-icons-round" style={{ fontSize: 16 }}>info</span>
        GIID Platform v2.1.0 · Build 2025.07
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function SettingsPage() {
  const [selected, setSelected] = useState<Section>("Profile");

  const navItems: { label: Section; icon: string }[] = [
    { label: "Profile", icon: "person" },
    { label: "Password & Security", icon: "lock" },
    { label: "Appearance", icon: "palette" },
    { label: "Language & Region", icon: "language" },
    { label: "Notifications", icon: "notifications" },
    { label: "Data & Backup", icon: "backup" },
    { label: "Help & Support", icon: "help" },
  ];

  const panelTitle: Record<Section, string> = {
    Profile: "Profile",
    "Password & Security": "Password & Security",
    Appearance: "Appearance",
    "Language & Region": "Language & Region",
    Notifications: "Notifications",
    "Data & Backup": "Data & Backup",
    "Help & Support": "Help & Support",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F4F8" }}>
      <Sidebar active="Settings" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <TopBar title="Settings" subtitle="Manage your account and platform preferences" />

        <div style={{ padding: "28px 32px", display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* ─── Left Nav ─── */}
          <div
            style={{
              width: 280,
              flexShrink: 0,
              background: "#fff",
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {navItems.map(({ label, icon }) => {
              const isActive = selected === label;
              return (
                <button
                  key={label}
                  onClick={() => setSelected(label)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 14px",
                    borderRadius: 14,
                    border: "none",
                    background: isActive ? primary + "12" : "transparent",
                    cursor: "pointer",
                    marginBottom: 4,
                    transition: "background 0.15s",
                  }}
                >
                  <span
                    className="material-icons-round"
                    style={{ fontSize: 20, color: isActive ? primary : muted }}
                  >
                    {icon}
                  </span>
                  <span
                    style={{
                      fontFamily: P,
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? primary : dark,
                    }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span
                      className="material-icons-round"
                      style={{ fontSize: 16, color: primary, marginLeft: "auto" }}
                    >
                      chevron_right
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── Right Content ─── */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 32,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontFamily: P, fontWeight: 800, fontSize: 20, color: dark, marginBottom: 28 }}>
                  {panelTitle[selected]}
                </div>

                {selected === "Profile" && <ProfilePanel />}
                {selected === "Password & Security" && <PasswordPanel />}
                {selected === "Appearance" && <AppearancePanel />}
                {selected === "Language & Region" && <LanguagePanel />}
                {selected === "Notifications" && <NotificationsPanel />}
                {selected === "Data & Backup" && <DataBackupPanel />}
                {selected === "Help & Support" && <HelpPanel />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
