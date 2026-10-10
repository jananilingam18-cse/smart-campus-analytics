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
const response = await fetch("https://campus-iq-backend-75l5.onrender.com/api/students");  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json() as Promise<ApiStudent[]>;
}
