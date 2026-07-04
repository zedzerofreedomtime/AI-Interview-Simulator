import type {
  AnswerEvaluation,
  DashboardData,
  InterviewSession,
  ResumeAnalysisResponse,
} from "@/lib/types";
import type { Language } from "@/components/providers/language-provider";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, init);
  if (!response.ok) {
    let message = `API request failed with ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // Keep the status-based fallback when the API returns a non-JSON error.
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>("/dashboard");
}

export function analyzeResume(
  file: File,
  language: Language,
): Promise<ResumeAnalysisResponse> {
  const body = new FormData();
  body.append("resume", file);
  body.append("language", language);
  return request<ResumeAnalysisResponse>("/resumes/analyze", {
    method: "POST",
    body,
  });
}

export function createInterview(
  targetRole: string,
  skills: string[],
  language: Language,
  count = 4,
): Promise<InterviewSession> {
  return request<InterviewSession>("/interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetRole, skills, language, count }),
  });
}

export function evaluateAnswer(
  sessionId: string,
  questionId: string,
  answer: string,
  language: Language,
): Promise<AnswerEvaluation> {
  return request<AnswerEvaluation>(
    `/interviews/${sessionId}/answers`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer, language }),
    },
  );
}
