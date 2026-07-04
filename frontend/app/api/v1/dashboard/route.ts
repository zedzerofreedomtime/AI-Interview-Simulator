import { NextResponse } from "next/server";
import type { DashboardData } from "@/lib/types";

export const runtime = "nodejs";

export function GET() {
  const dashboard: DashboardData = {
    greetingName: "Methasit",
    readiness: 74,
    targetRole: "Backend Developer",
    candidateProfile: {
      name: "Methasit",
      career: "Backend Developer",
      experienceLevel: "Junior",
      skills: ["Go", "React", "PostgreSQL", "Redis"],
      missingSkills: ["Testing", "Cloud Deployment", "System Design"],
      analysisSummary:
        "Candidate profile is ready for backend interview practice. Upload a resume for a deeper AI-generated analysis.",
      analysisSections: [],
    },
    recentInterviews: [
      {
        id: "demo-1",
        date: new Date().toISOString(),
        role: "Backend Developer",
        duration: "32 min",
        score: 74,
        topics: ["Go", "API Design", "PostgreSQL"],
        result: "Good",
      },
    ],
    roadmap: [
      {
        week: 1,
        title: "API fundamentals",
        description: "Practice REST design, validation, and error handling.",
        hours: 6,
        outcomes: ["Build CRUD APIs", "Return consistent JSON errors"],
      },
      {
        week: 2,
        title: "Database readiness",
        description: "Improve SQL, indexes, transactions, and query debugging.",
        hours: 8,
        outcomes: ["Explain indexes", "Debug slow queries"],
      },
    ],
  };

  return NextResponse.json(dashboard);
}
