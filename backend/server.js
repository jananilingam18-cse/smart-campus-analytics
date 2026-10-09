const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const students = [
  { id: 1, name: "Aarav Sharma", department: "CSE", cgpa: 8.6, attendance: 92, assignments: 95, backlogs: 0 },
  { id: 2, name: "Diya Reddy", department: "CSE", cgpa: 6.1, attendance: 68, assignments: 55, backlogs: 2 },
  { id: 3, name: "Meera Patel", department: "IT", cgpa: 9.1, attendance: 96, assignments: 98, backlogs: 0 }
];

function addScore(s) {
  const score = Math.round(s.cgpa * 3 + s.attendance * 0.25 + s.assignments * 0.20 - s.backlogs * 5);
  const successScore = Math.max(0, Math.min(100, score));
  return {
    ...s,
    successScore,
    riskLevel: successScore < 50 ? "High" : successScore < 70 ? "Medium" : "Low"
  };
}

app.get("/", (req, res) => res.send("Campus IQ Backend is running!"));
app.get("/api/students", (req, res) => res.json(students.map(addScore)));

app.get("/api/analytics/summary", (req, res) => {
  const data = students.map(addScore);
  res.json({
    totalStudents: data.length,
    highRiskStudents: data.filter(s => s.riskLevel === "High").length,
    mediumRiskStudents: data.filter(s => s.riskLevel === "Medium").length,
    lowRiskStudents: data.filter(s => s.riskLevel === "Low").length
  });
});

app.listen(5000, () => console.log("Campus IQ backend running at http://localhost:5000"));
