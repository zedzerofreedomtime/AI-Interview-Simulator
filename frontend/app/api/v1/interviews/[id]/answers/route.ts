import { NextResponse } from "next/server";
import type { AnswerEvaluation } from "@/lib/types";
import {
  fallbackEvaluation,
  generateJSON,
  languageName,
  normalizeLanguage,
} from "../../../_lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

type EvaluateBody = {
  questionId?: string;
  answer?: string;
  language?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as EvaluateBody;
  const answer = body.answer?.trim();
  const language = normalizeLanguage(body.language ?? null);

  if (!body.questionId || !answer) {
    return NextResponse.json(
      { error: "questionId and answer are required" },
      { status: 400 },
    );
  }

  try {
    const evaluation = await generateJSON<AnswerEvaluation>([
      {
        text: `Evaluate this technical interview answer honestly and constructively.

Question ID: ${body.questionId}
Candidate answer: ${answer}
Output language: ${languageName(language)}

Return valid JSON only:
{
  "score": 0,
  "accuracy": 0,
  "technicalDepth": 0,
  "communication": 0,
  "problemSolving": 0,
  "completeness": 0,
  "feedback": "Specific strengths, missing points, and how to improve"
}

All scores must be integers from 0 to 100. Write the entire feedback in the requested output language.`,
      },
    ]);
    return NextResponse.json(evaluation);
  } catch {
    return NextResponse.json(fallbackEvaluation(language));
  }
}
