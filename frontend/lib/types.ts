export type InterviewSummary = {
  id: string;
  date: string;
  role: string;
  duration: string;
  score: number;
  topics: string[];
  result: "Good" | "Average" | "Needs work";
};

export type RoadmapItem = {
  week: number;
  title: string;
  description: string;
  hours: number;
  outcomes: string[];
};

export type CandidateProfile = {
  name: string;
  career: string;
  experienceLevel: string;
  skills: string[];
  missingSkills: string[];
  analysisSummary?: string;
  analysisSections?: AnalysisSection[];
};

export type AnalysisSection = {
  title: string;
  description: string;
  score?: number;
  items: AnalysisItem[];
  metadata?: Record<string, string>;
};

export type AnalysisItem = {
  label: string;
  insight: string;
  evidence?: string[];
  impact?: string;
  recommendation?: string;
};

export type DashboardData = {
  greetingName: string;
  readiness: number;
  targetRole: string;
  candidateProfile: CandidateProfile;
  recentInterviews: InterviewSummary[];
  roadmap: RoadmapItem[];
};

export type ResumeAnalysisResponse = {
  resumeId: string;
  candidateProfile: CandidateProfile;
};

export type AnswerEvaluation = {
  score: number;
  accuracy: number;
  technicalDepth: number;
  communication: number;
  problemSolving: number;
  completeness: number;
  feedback: string;
};

export type InterviewQuestion = {
  id: string;
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type InterviewSession = {
  id: string;
  targetRole: string;
  questions: InterviewQuestion[];
  createdAt: string;
};
