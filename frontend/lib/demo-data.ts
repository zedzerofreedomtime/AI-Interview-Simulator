import type {
  DashboardData,
  InterviewQuestion,
  InterviewSummary,
  RoadmapItem,
} from "@/lib/types";

export const demoInterviews: InterviewSummary[] = [
  {
    id: "int-1",
    date: "May 12, 2026",
    role: "Backend Developer",
    duration: "45m",
    score: 78,
    topics: ["Go", "SQL", "System Design"],
    result: "Good",
  },
  {
    id: "int-2",
    date: "May 10, 2026",
    role: "Backend Developer",
    duration: "50m",
    score: 65,
    topics: ["API Design", "PostgreSQL"],
    result: "Average",
  },
  {
    id: "int-3",
    date: "May 7, 2026",
    role: "Backend Developer",
    duration: "40m",
    score: 82,
    topics: ["Go", "Redis", "Concurrency"],
    result: "Good",
  },
  {
    id: "int-4",
    date: "May 4, 2026",
    role: "Backend Developer",
    duration: "35m",
    score: 58,
    topics: ["Data Structures", "SQL"],
    result: "Needs work",
  },
];

export const roadmap: RoadmapItem[] = [
  {
    week: 1,
    title: "Docker",
    description:
      "Package a Go API and learn the container workflow used by modern backend teams.",
    hours: 6,
    outcomes: ["Write a Dockerfile", "Use Docker Compose"],
  },
  {
    week: 2,
    title: "GitHub Actions",
    description:
      "Build a small CI pipeline that checks code quality before deployment.",
    hours: 5,
    outcomes: ["Run tests in CI", "Build container images"],
  },
  {
    week: 3,
    title: "Unit Testing",
    description:
      "Practice table-driven tests and isolate service behavior with interfaces.",
    hours: 7,
    outcomes: ["Test Go services", "Mock repositories"],
  },
  {
    week: 4,
    title: "Deployment",
    description:
      "Deploy the full stack and learn production configuration fundamentals.",
    hours: 6,
    outcomes: ["Manage environment config", "Add health checks"],
  },
];

export const demoDashboard: DashboardData = {
  greetingName: "Methasit",
  readiness: 78,
  targetRole: "Backend Developer",
  candidateProfile: {
    name: "Methasit",
    career: "Backend Developer",
    experienceLevel: "Junior",
    skills: ["Go", "React", "PostgreSQL", "Redis"],
    missingSkills: ["Docker", "CI/CD", "Testing"],
    analysisSummary:
      "Strong backend foundation with room to add clearer production evidence, testing, deployment, and project impact.",
    analysisSections: [
      {
        title: "Resume depth",
        description:
          "High-level demo analysis for the dashboard fallback profile.",
        score: 72,
        items: [
          {
            label: "Backend signal",
            insight:
              "Go, PostgreSQL, and Redis point toward backend API work.",
            recommendation:
              "Add measurable project outcomes and deployment details.",
          },
        ],
      },
    ],
  },
  recentInterviews: demoInterviews,
  roadmap,
};

export const demoQuestions: InterviewQuestion[] = [
  {
    id: "q1",
    category: "Authentication",
    difficulty: "Medium",
    text: "How does JWT authentication work, and what security trade-offs should a backend developer understand?",
  },
  {
    id: "q2",
    category: "Caching",
    difficulty: "Medium",
    text: "When would you use Redis in a production API, and how would you prevent stale cache data?",
  },
  {
    id: "q3",
    category: "Databases",
    difficulty: "Hard",
    text: "Explain how a database index improves query performance and when an index can make performance worse.",
  },
  {
    id: "q4",
    category: "Architecture",
    difficulty: "Hard",
    text: "Design an API authentication flow that supports access tokens, refresh tokens, and logout across multiple devices.",
  },
];
