export interface ApiStudent {
  id: number;
  name: string;
  department: string;
  cgpa: number;
  attendance: number;
  assignments: number;
  backlogs: number;
  successScore: number;
  riskLevel: "High" | "Medium" | "Low";
}

export async function fetchBackendStudents(): Promise<ApiStudent[]> {
const response = await fetch("http://localhost:5000/api/students");
  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json() as Promise<ApiStudent[]>;
}
