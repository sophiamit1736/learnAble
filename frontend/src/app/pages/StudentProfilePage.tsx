import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import API from "../api/studentApi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Sidebar, TopBar } from "./DashboardPage";

const P = "Poppins, sans-serif";

const weeklyProgress = [
  { week: "W1", alpi: 60 },
  { week: "W2", alpi: 66 },
  { week: "W3", alpi: 72 },
  { week: "W4", alpi: 78 },
];

const monthlyProgress = [
  { month: "Mar", alpi: 55 },
  { month: "Apr", alpi: 60 },
  { month: "May", alpi: 67 },
  { month: "Jun", alpi: 74 },
  { month: "Jul", alpi: 80 },
];

const activityHistory = [
  {
    activity: "Shape Matching",
    date: "20 Jul 2026",
    score: "9/10",
    duration: "12 mins",
    status: "Completed",
  },
  {
    activity: "Colour Matching",
    date: "18 Jul 2026",
    score: "8/10",
    duration: "10 mins",
    status: "Completed",
  },
  {
    activity: "Alphabet Match",
    date: "15 Jul 2026",
    score: "10/10",
    duration: "15 mins",
    status: "Completed",
  },
];

const notes = [
  {
    author: "Teacher",
    date: "22 Jul 2026",
    note: "Student showed good improvement in visual matching.",
  },
  {
    author: "Teacher",
    date: "18 Jul 2026",
    note: "Able to complete activities independently.",
  },
];

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#fff",
        border: "1px solid rgba(21,101,192,.08)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl mb-4"
        style={{
          width: 45,
          height: 45,
          background: bg,
        }}
      >
        <span
          className="material-icons-round"
          style={{
            color,
          }}
        >
          {icon}
        </span>
      </div>

      <div
        style={{
          fontFamily: P,
          fontWeight: 700,
          fontSize: 24,
          color: "#0D2137",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontFamily: P,
          color: "#666",
          fontSize: 13,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ProgressRing({
  value,
}: {
  value: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="110" height="110">
      <circle
        cx="55"
        cy="55"
        r={radius}
        stroke="#E3F2FD"
        strokeWidth="10"
        fill="transparent"
      />

      <circle
        cx="55"
        cy="55"
        r={radius}
        stroke="#1565C0"
        strokeWidth="10"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 55 55)"
        strokeLinecap="round"
      />

      <text
        x="55"
        y="60"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="#0D2137"
      >
        {value}
      </text>
    </svg>
  );
}

export default function StudentProfilePage() {

  const { id } = useParams();

  const [student, setStudent] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchStudent();

  }, []);

  async function fetchStudent() {

    try {

      const res = await API.get(`/${id}`);

      setStudent(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return <h2 style={{ padding: 30 }}>Loading...</h2>;

  }

  if (!student) {

    return <h2 style={{ padding: 30 }}>Student not found.</h2>;

  }

  const initials = student.name
    ?.split(" ")
    .map((x: string) => x[0])
    .join("")
    .substring(0, 2);

  const avatarColor = "#1565C0";

  const avatarBg = "#E3F2FD";

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#F0F6FF" }}>
  <Sidebar active="Students" />

  <div className="flex-1 flex flex-col min-w-0">

    <TopBar
      title="Student Profile"
      subtitle="View complete student information"
    />

    <main className="flex-1 p-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">

        <Link
          to="/students"
          style={{
            fontFamily: P,
            color: "#1565C0",
            textDecoration: "none",
          }}
        >
          Students
        </Link>

        <span className="material-icons-round">
          chevron_right
        </span>

        <span>{student.name}</span>

      </div>

      {/* Hero Card */}

      <motion.div

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        className="rounded-3xl overflow-hidden"

        style={{
          background: "#fff",
          border: "1px solid rgba(21,101,192,.08)",
        }}
      >

        <div
          style={{
            height: 120,
            background:
              "linear-gradient(135deg,#1565C0,#27AE60)",
          }}
        />

        <div
          className="px-8 pb-6"
          style={{ marginTop: -45 }}
        >

          <div className="flex justify-between">

            <div className="flex gap-5">

              <div

                className="rounded-full d-flex"

                style={{
                  width: 90,
                  height: 90,
                  background: avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "4px solid white",
                }}
              >

                <span

                  style={{
                    fontFamily: P,
                    fontWeight: 700,
                    fontSize: 28,
                    color: avatarColor,
                  }}
                >

                  {initials}

                </span>

              </div>

              <div style={{ paddingTop: 45 }}>

                <h2
                  style={{
                    fontFamily: P,
                    fontWeight: 700,
                  }}
                >
                  {student.name}
                </h2>

                <div
                  style={{
                    color: "#666",
                    marginTop: 6,
                  }}
                >

                  {student.studentCode}

                  {" • "}

                  {student.age} Years

                  {" • "}

                  {student.gender}

                </div>

                <div
                  style={{
                    marginTop: 10,
                  }}
                >

                  <span

                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: "#FFF9C4",
                      color: "#F57F17",
                      marginRight: 10,
                      fontSize: 13,
                    }}
                  >

                    {student.learningLevel}

                  </span>

                  <span

                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: "#E8F5E9",
                      color: "#2E7D32",
                      fontSize: 13,
                    }}
                  >

                    {student.status}

                  </span>

                </div>

              </div>

            </div>

            <div
              className="flex gap-3"
              style={{
                paddingTop: 45,
              }}
            >

              <Link to={`/students/edit/${student._id}`}>

                <button
                  className="px-4 py-2 rounded-xl"
                  style={{
                    background: "#E3F2FD",
                    border: "none",
                    color: "#1565C0",
                  }}
                >
                  Edit
                </button>

              </Link>

              <Link to={`/observation/${student._id}`}>

                <button
                  className="px-4 py-2 rounded-xl"
                  style={{
                    background: "#E8F5E9",
                    border: "none",
                    color: "#2E7D32",
                  }}
                >
                  Observe
                </button>

              </Link>

            </div>

          </div>

        </div>

      </motion.div>

      {/* Information */}

      <div
        className="grid grid-cols-4 gap-4 mt-6"
      >

        <StatCard
          label="FACP Score"
          value={String(student.facpScore)}
          icon="assessment"
          color="#27AE60"
          bg="#E8F5E9"
        />

        <StatCard
          label="Learning Level"
          value={student.learningLevel}
          icon="school"
          color="#1565C0"
          bg="#E3F2FD"
        />

        <StatCard
          label="Disability"
          value={student.disabilityLevel}
          icon="psychology"
          color="#EF6C00"
          bg="#FFF3E0"
        />

        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid rgba(21,101,192,.08)",
          }}
        >

          <div className="flex justify-center">

            <ProgressRing value={75} />

          </div>

          <div
            style={{
              textAlign: "center",
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            ALPI Score
          </div>

        </div>

      </div>

      {/* Guardian Details */}

      <div

        className="rounded-2xl p-6 mt-6"

        style={{
          background: "#fff",
          border: "1px solid rgba(21,101,192,.08)",
        }}
      >

        <h3
          style={{
            fontFamily: P,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Guardian Information
        </h3>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <b>Name</b>

            <br />

            {student.guardianName}

          </div>

          <div>

            <b>Phone</b>

            <br />

            {student.guardianPhone}

          </div>

          <div className="col-span-2">

            <b>Address</b>

            <br />

            {student.address}

          </div>

        </div>

      </div>
                {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">

            <div
              className="rounded-2xl p-5 flex flex-col items-center gap-2"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(21,101,192,0.08)",
              }}
            >
              <ProgressRing value={75} />
              <div
                style={{
                  fontFamily: P,
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#0D2137",
                }}
              >
                Current ALPI
              </div>
            </div>

            <StatCard
              label="FACP Score"
              value={String(student.facpScore || 0)}
              icon="assessment"
              color="#27ae60"
              bg="#E8F5E9"
            />

            <StatCard
              label="Learning Level"
              value={student.learningLevel}
              icon="school"
              color="#1565C0"
              bg="#E3F2FD"
            />

            <StatCard
              label="Status"
              value={student.status}
              icon="check_circle"
              color="#FF9800"
              bg="#FFF3E0"
            />

          </div>

          {/* Charts */}

          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >

            <div
              className="rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid rgba(21,101,192,.08)",
              }}
            >
              <h3
                style={{
                  fontFamily: P,
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                Weekly Progress
              </h3>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="alpi" fill="#1565C0" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid rgba(21,101,192,.08)",
              }}
            >
              <h3
                style={{
                  fontFamily: P,
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                Monthly Progress
              </h3>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    dataKey="alpi"
                    stroke="#27ae60"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Student Information */}

          <div
            className="rounded-2xl p-6"
            style={{
              background: "#fff",
              border: "1px solid rgba(21,101,192,.08)",
            }}
          >

            <h3
              style={{
                fontFamily: P,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              Student Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <Info label="Student Code" value={student.studentCode} />

              <Info label="Gender" value={student.gender} />

              <Info label="Age" value={`${student.age} Years`} />

              <Info
                label="Disability Level"
                value={student.disabilityLevel}
              />

              <Info
                label="Learning Level"
                value={student.learningLevel}
              />

              <Info
                label="Guardian"
                value={student.guardianName}
              />

              <Info
                label="Guardian Phone"
                value={student.guardianPhone}
              />

              <Info
                label="Address"
                value={student.address || "-"}
              />

            </div>

          </div>

        </main>

      </div>

    </div>

  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: P,
          fontSize: 12,
          color: "#607D8B",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: P,
          fontWeight: 600,
          fontSize: 15,
          color: "#0D2137",
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}