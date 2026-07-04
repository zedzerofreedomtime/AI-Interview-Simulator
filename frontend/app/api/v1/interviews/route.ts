import { NextResponse } from "next/server";
import type { InterviewQuestion } from "@/lib/types";
import {
  fallbackQuestions,
  generateJSON,
  languageName,
  normalizeLanguage,
} from "../_lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

type CreateInterviewBody = {
  targetRole?: string;
  skills?: string[];
  count?: number;
  language?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CreateInterviewBody;
  const targetRole = body.targetRole?.trim() || "Backend Developer";
  const skills = Array.isArray(body.skills) ? body.skills : [];
  const count = Math.max(1, Math.min(body.count ?? 4, 8));
  const language = normalizeLanguage(body.language ?? null);

  let questions: InterviewQuestion[];
  try {
    const result = await generateJSON<{ questions: InterviewQuestion[] }>([
      {
        text: `Create ${count} technical interview questions for a ${targetRole} candidate.
Candidate skills: ${skills.join(", ") || "not specified"}
Output language: ${languageName(language)}

Return valid JSON only:
{"questions":[{"id":"q1","text":"...","category":"...","difficulty":"Easy|Medium|Hard"}]}

Make questions practical, role-relevant, non-duplicative, and progressively challenging.
Write every question and category in the requested output language. Keep code, API names, programming languages, and technical terms in their standard form.
Difficulty must remain exactly Easy, Medium, or Hard.`,
      },
    ]);
    questions = result.questions?.length
      ? result.questions.slice(0, count)
      : fallbackQuestions(language).slice(0, count);
  } catch {
    questions = fallbackQuestions(language).slice(0, count);
  }

  questions = questions.map((question, index) => ({
    ...question,
    id: question.id || `q${index + 1}`,
    difficulty: ["Easy", "Medium", "Hard"].includes(question.difficulty)
      ? question.difficulty
      : "Medium",
  }));

  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      targetRole,
      questions,
      createdAt: new Date().toISOString(),
    },
    { status: 201 },
  );
}
