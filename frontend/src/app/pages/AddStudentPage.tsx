import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sidebar, TopBar } from "./DashboardPage";
import API from "../api/studentApi";

const P = "Poppins, sans-serif";

function Field({
  label, id, type = "text", placeholder, value, onChange, required, icon, options, note,
}: {
  label: string; id: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; required?: boolean; icon?: string; options?: string[]; note?: string;
}) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%", fontFamily: P, fontSize: 14, color: "#0D2137", outline: "none",
    border: `1.5px solid ${focused ? "#1565C0" : "rgba(21,101,192,0.18)"}`,
    borderRadius: 14, padding: "11px 14px", background: focused ? "#f0f7ff" : "#F8FAFF",
    boxShadow: focused ? "0 0 0 3px rgba(21,101,192,0.10)" : "none",
    transition: "all 0.18s",
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} style={{ fontFamily: P, fontWeight: 500, fontSize: 13, color: "#0D2137" }}>
        {label}{required && <span style={{ color: "#EF5350" }}> *</span>}
      </label>
      {options ? (
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        >
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          style={{ ...base, resize: "none" }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        />
      )}
      {note && <p style={{ fontFamily: P, fontSize: 11, color: "#4A6580" }}>{note}</p>}
    </div>
  );
}

export default function AddStudentPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: "", dateOfBirth: "", gender: "", disability: "", learningLevel: "",
    facp: "", guardian: "", phone: "", address: "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [k]: v }));

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if(!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

async function handleSave(e: React.FormEvent) {
  e.preventDefault();

  try {
    setSaved(true);

    const student = {
      fullName: form.fullName,

      dateOfBirth: new Date(
        new Date().setFullYear(
          new Date().getFullYear() - Number(form.dateOfBirth)
        )
      ),

      gender: form.gender,

      disabilityLevel: form.disability,

      learningLevel: form.learningLevel,

      facpBaseline: Number(form.facp),

      guardianName: form.guardian,

      guardianPhone: form.phone,

      address: form.address,
    };

    await API.post("/", student);

    alert("Student Added Successfully");

    navigate("/students");

  } catch (err) {

    console.log(err);

    alert("Unable to Save Student");

    setSaved(false);

  }
}

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#F0F6FF" }}>
      <Sidebar active="Students" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Add New Student" subtitle="Fill in the details to register a new student" />

        <main className="flex-1 p-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
            style={{ maxWidth: 780 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link to="/students" style={{ fontFamily: P, fontSize: 13, color: "#1565C0", textDecoration: "none" }}>Students</Link>
              <span className="material-icons-round" style={{ fontSize: 16, color: "#90a4b8" }}>chevron_right</span>
              <span style={{ fontFamily: P, fontSize: 13, color: "#4A6580" }}>Add New Student</span>
            </div>

            <form onSubmit={handleSave}>
              {/* Photo upload card */}
              <div className="rounded-2xl p-6 mb-5 flex items-center gap-6" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 16px rgba(21,101,192,0.07)" }}>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all"
                  style={{
                    width: 110, height: 110, flexShrink: 0,
                    border: `2px dashed ${preview ? "transparent" : "rgba(21,101,192,0.3)"}`,
                    background: preview ? "transparent" : "#F0F6FF",
                    overflow: "hidden",
                  }}
                >
                  {preview ? (
                    <img src={preview} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
                  ) : (
                    <>
                      <span className="material-icons-round" style={{ fontSize: 36, color: "#90a4b8" }}>add_a_photo</span>
                      <span style={{ fontFamily: P, fontSize: 11, color: "#4A6580", marginTop: 4 }}>Upload Photo</span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <div>
                  <div style={{ fontFamily: P, fontWeight: 600, fontSize: 15, color: "#0D2137", marginBottom: 4 }}>Student Photo</div>
                  <div style={{ fontFamily: P, fontWeight: 400, fontSize: 13, color: "#4A6580", lineHeight: 1.6 }}>
                    Click to upload a clear photo of the student.<br />
                    Accepted formats: JPG, PNG. Max size: 2MB.
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{ background: "#E3F2FD", border: "none", fontFamily: P, fontSize: 13, fontWeight: 500, color: "#1565C0", cursor: "pointer" }}
                  >
                    <span className="material-icons-round" style={{ fontSize: 16 }}>upload</span>
                    {preview ? "Change Photo" : "Choose File"}
                  </button>
                </div>
              </div>

              {/* Personal info */}
              <Section title="Personal Information" icon="person">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Field label="Student Full Name" id="fullName" placeholder="e.g. Aarav Kumar" value={form.fullName} onChange={set("fullName")} required icon="person" />
                  </div>
                  <Field label="Date of Birth" id="dateOfBirth" type="number" placeholder="e.g. 10" value={form.dateOfBirth} onChange={set("dateOfBirth")} required />
                  <Field label="Gender" id="gender" value={form.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} required />
                </div>
              </Section>

              {/* Clinical info */}
              <Section title="Clinical Information" icon="medical_information">
                <div className="grid grid-cols-2 gap-5">
                  <Field
                    label="Disability Level"
                    id="disability"
                    value={form.disability}
                    onChange={set("disability")}
                    options={["Mild","Moderate","Severe"]}
                    required
                    note="Refer to IQ classification (WHO guidelines)"
                  />
                  <Field
                    label="Learning Level"
                    id="learningLevel"
                    value={form.learningLevel}
                    onChange={set("learningLevel")}
                    options={["Beginner","Intermediate","Advanced"]}
                    required
                  />
                  <Field
                    label="FACP Baseline Score"
                    id="facp"
                    type="number"
                    placeholder="0 – 100"
                    value={form.facp}
                    onChange={set("facp")}
                    note="Functional Assessment Checklist for Programming baseline score"
                  />
                </div>
              </Section>

              {/* Guardian info */}
              <Section title="Guardian Information" icon="family_restroom">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Guardian Name" id="guardian" placeholder="Parent / Guardian full name" value={form.guardian} onChange={set("guardian")} required />
                  <Field label="Phone Number" id="phone" type="tel" placeholder="+91 99999 00000" value={form.phone} onChange={set("phone")} required />
                  <div className="col-span-2">
                    <Field label="Address" id="address" type="textarea" placeholder="Home address..." value={form.address} onChange={set("address")} />
                  </div>
                </div>
              </Section>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-6 justify-end">
                <Link to="/students" style={{ textDecoration: "none" }}>
                  <button type="button" className="px-6 py-3 rounded-xl" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.2)", fontFamily: P, fontWeight: 600, fontSize: 14, color: "#4A6580", cursor: "pointer" }}>
                    Cancel
                  </button>
                </Link>
                <motion.button
                  type="submit"
                  disabled={saved}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl"
                  style={{
                    background: saved ? "#4aaa78" : "linear-gradient(135deg,#1565C0,#27ae60)",
                    border: "none", fontFamily: P, fontWeight: 600, fontSize: 14, color: "#fff", cursor: saved ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(21,101,192,0.28)",
                  }}
                  aria-busy={saved}
                >
                  {saved ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-icons-round" style={{ fontSize: 18 }}>save</span>
                      Save Student
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 mb-5" style={{ background: "#fff", border: "1.5px solid rgba(21,101,192,0.08)", boxShadow: "0 2px 16px rgba(21,101,192,0.07)" }}>
      <div className="flex items-center gap-2 mb-5 pb-4 border-b" style={{ borderColor: "rgba(21,101,192,0.08)" }}>
        <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1565C0,#27ae60)" }}>
          <span className="material-icons-round text-white" style={{ fontSize: 17 }}>{icon}</span>
        </div>
        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#0D2137" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
