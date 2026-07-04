import { NextResponse } from "next/server";
import type { CandidateProfile } from "@/lib/types";
import {
  fallbackProfile,
  generateJSON,
  languageName,
  mimeFromName,
  normalizeLanguage,
} from "../../_lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("resume");
  const language = normalizeLanguage(form.get("language"));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "resume file is required" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "resume must be 10 MB or smaller" },
      { status: 413 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = mimeFromName(file.name);
    const profile = await generateJSON<CandidateProfile>([
      {
        text: `Analyze the attached resume file named "${file.name}".
Output language: ${languageName(language)}

Return a rich, open-ended JSON object matching this TypeScript shape exactly:
{
  "name": "string",
  "career": "string",
  "experienceLevel": "string",
  "skills": ["string"],
  "missingSkills": ["string"],
  "analysisSummary": "string",
  "analysisSections": [
    {
      "title": "string",
      "description": "string",
      "score": 0,
      "items": [
        {
          "label": "string",
          "insight": "string",
          "evidence": ["string"],
          "impact": "string",
          "recommendation": "string"
        }
      ],
      "metadata": {"key": "value"}
    }
  ]
}

Do not limit the analysis to a small fixed checklist. Create as many useful analysisSections as the resume deserves.
Write every human-readable analysis field in the requested output language. Keep names, programming languages, technologies, product names, and code in their standard form.
Return valid JSON only.`,
      },
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ]);

    return NextResponse.json(
      {
        resumeId: crypto.randomUUID(),
        candidateProfile: normalizeProfile(profile, language, file.name),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        resumeId: crypto.randomUUID(),
        candidateProfile: fallbackProfile(language, file.name),
      },
      { status: 201 },
    );
  }
}

function normalizeProfile(
  profile: CandidateProfile,
  language: string,
  fileName: string,
): CandidateProfile {
  const fallback = fallbackProfile(language, fileName);
  return {
    ...profile,
    name: profile.name || fallback.name,
    career: profile.career || fallback.career,
    experienceLevel: profile.experienceLevel || fallback.experienceLevel,
    skills: profile.skills?.length ? profile.skills : fallback.skills,
    missingSkills: profile.missingSkills ?? [],
    analysisSummary: profile.analysisSummary || fallback.analysisSummary,
    analysisSections: profile.analysisSections ?? [],
  };
}
