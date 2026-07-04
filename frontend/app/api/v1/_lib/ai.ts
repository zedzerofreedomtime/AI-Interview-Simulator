import type {
  AnswerEvaluation,
  CandidateProfile,
  InterviewQuestion,
} from "@/lib/types";

const geminiModels = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

type GeminiPart = {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
};

export function normalizeLanguage(language: FormDataEntryValue | string | null) {
  return String(language ?? "").trim().toLowerCase() === "th" ? "th" : "en";
}

export function languageName(language: string) {
  return language === "th" ? "Thai" : "English";
}

export async function generateJSON<T>(parts: GeminiPart[]): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  let lastError: unknown;
  for (const model of geminiModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: "You are an expert technical recruiter, software engineering interviewer, ATS reviewer, and career coach. Return only valid JSON.",
                },
              ],
            },
            contents: [{ role: "user", parts }],
            generationConfig: {
              temperature: 0.25,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      const body = await response.text();
      if (!response.ok) {
        throw new Error(`Gemini returned ${response.status}: ${body}`);
      }

      const payload = JSON.parse(body) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = payload.candidates
        ?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => part.text?.trim())
        .find(Boolean);

      if (!text) {
        throw new Error("Gemini returned no text");
      }

      return JSON.parse(cleanJSON(text)) as T;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Gemini request failed");
}

export function cleanJSON(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function mimeFromName(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".txt")) return "text/plain";
  return "application/octet-stream";
}

export function fallbackProfile(language: string, fileName = "resume"): CandidateProfile {
  if (language === "th") {
    return {
      name: "Candidate",
      career: "Software Developer",
      experienceLevel: "Junior",
      skills: ["Go", "React", "PostgreSQL"],
      missingSkills: ["Testing", "Cloud Deployment", "System Design"],
      analysisSummary: `วิเคราะห์ ${fileName} แบบโหมดสำรองแล้ว โปรไฟล์ดูเหมาะกับสายพัฒนาเว็บ/แบ็กเอนด์ระดับเริ่มต้น`,
      analysisSections: [
        {
          title: "ภาพรวมผู้สมัคร",
          description: "ระบบสำรองประเมินจากชื่อไฟล์และบริบทโปรเจค",
          score: 72,
          items: [
            {
              label: "จุดแข็ง",
              insight: "มีทักษะหลักที่เกี่ยวกับงาน Backend และ Full-stack",
              recommendation: "เพิ่มหลักฐานเป็นโปรเจคจริง ตัวเลขผลลัพธ์ และ link GitHub/Deploy",
            },
          ],
        },
      ],
    };
  }

  return {
    name: "Candidate",
    career: "Software Developer",
    experienceLevel: "Junior",
    skills: ["Go", "React", "PostgreSQL"],
    missingSkills: ["Testing", "Cloud Deployment", "System Design"],
    analysisSummary: `Fallback analysis completed for ${fileName}. The profile looks aligned with junior web/backend roles.`,
    analysisSections: [
      {
        title: "Candidate Overview",
        description: "Fallback assessment based on file context and project defaults.",
        score: 72,
        items: [
          {
            label: "Strength",
            insight: "Core skills are relevant to backend and full-stack development.",
            recommendation: "Add concrete project evidence, measurable impact, and GitHub/deployment links.",
          },
        ],
      },
    ],
  };
}

export function fallbackQuestions(language: string): InterviewQuestion[] {
  if (language === "th") {
    return [
      {
        id: "q1",
        text: "อธิบายวิธีออกแบบ REST API สำหรับสร้างผู้ใช้ใหม่ใน Go พร้อม validation และ response ที่เหมาะสม",
        category: "API Design, Go",
        difficulty: "Easy",
      },
      {
        id: "q2",
        text: "ถ้า endpoint ช้าเพราะ query PostgreSQL คุณจะตรวจสอบและแก้ปัญหาอย่างไร",
        category: "Database Performance",
        difficulty: "Medium",
      },
      {
        id: "q3",
        text: "ออกแบบ session flow สำหรับระบบสัมภาษณ์ AI ที่ต้องเก็บคำถาม คำตอบ และคะแนน",
        category: "System Design",
        difficulty: "Medium",
      },
      {
        id: "q4",
        text: "คุณจะทำให้ API ปลอดภัยและพร้อม deploy production อย่างไร",
        category: "Security, Deployment",
        difficulty: "Hard",
      },
    ];
  }

  return [
    {
      id: "q1",
      text: "Design a REST API endpoint in Go for creating a new user, including validation and JSON responses.",
      category: "API Design, Go",
      difficulty: "Easy",
    },
    {
      id: "q2",
      text: "How would you debug and optimize a slow PostgreSQL-backed endpoint?",
      category: "Database Performance",
      difficulty: "Medium",
    },
    {
      id: "q3",
      text: "Design an interview session flow that stores questions, answers, and AI scores.",
      category: "System Design",
      difficulty: "Medium",
    },
    {
      id: "q4",
      text: "How would you secure and productionize this API before deployment?",
      category: "Security, Deployment",
      difficulty: "Hard",
    },
  ];
}

export function fallbackEvaluation(language: string): AnswerEvaluation {
  return language === "th"
    ? {
        score: 72,
        accuracy: 72,
        technicalDepth: 68,
        communication: 78,
        problemSolving: 70,
        completeness: 72,
        feedback:
          "คำตอบมีทิศทางดีและสื่อสารเข้าใจง่าย แต่ควรเพิ่มรายละเอียดเชิงเทคนิค เช่น error handling, validation, trade-off และตัวอย่างโค้ดหรือ flow ที่ชัดเจนขึ้น",
      }
    : {
        score: 72,
        accuracy: 72,
        technicalDepth: 68,
        communication: 78,
        problemSolving: 70,
        completeness: 72,
        feedback:
          "Your answer is directionally solid and easy to follow. Add more technical detail such as error handling, validation, trade-offs, and a concrete code or flow example.",
      };
}
