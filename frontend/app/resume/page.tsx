"use client";

import { useRef, useState } from "react";
import { FileText, Sparkles, UploadCloud, X } from "lucide-react";
import { analyzeResume } from "@/lib/api";
import type { CandidateProfile } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";
import type { AnalysisSection } from "@/lib/types";

function FullAnalysis({
  sections,
  isThai,
}: {
  sections: AnalysisSection[];
  isThai: boolean;
}) {
  if (!sections.length) return null;

  return (
    <section className="mt-6 panel p-5 md:p-7">
      <div className="mb-5">
        <p className="text-sm font-semibold text-[#635bff]">
          {isThai ? "วิเคราะห์เต็มรูปแบบ" : "Full AI analysis"}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">
          {isThai ? "ไม่จำกัดแค่โปรไฟล์พื้นฐาน" : "Beyond a fixed profile schema"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isThai
            ? "ระบบสามารถเพิ่มหัวข้อวิเคราะห์ใหม่ได้เรื่อย ๆ เช่น ATS, ความลึกโปรเจกต์, ความเสี่ยง, แผนซ้อมสัมภาษณ์ และคำแนะนำแก้เรซูเม่"
            : "The API can return any number of analysis sections, including ATS, project depth, risk, interview strategy, and resume rewrite guidance."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>
              </div>
              {typeof section.score === "number" ? (
                <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
                  {section.score}/100
                </span>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              {section.items.map((item) => (
                <div
                  key={`${section.title}-${item.label}`}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.insight}
                  </p>
                  {item.evidence?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.evidence.map((evidence) => (
                        <span
                          key={evidence}
                          className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                        >
                          {evidence}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {item.impact ? (
                    <p className="mt-3 text-sm leading-6 text-amber-700">
                      {isThai ? "ผลกระทบ: " : "Impact: "}
                      {item.impact}
                    </p>
                  ) : null}
                  {item.recommendation ? (
                    <p className="mt-3 text-sm leading-6 text-emerald-700">
                      {isThai ? "แนะนำ: " : "Recommendation: "}
                      {item.recommendation}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ResumePage() {
  const { isThai, language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function submit() {
    if (!file) return;
    setStatus("uploading");
    setErrorMessage("");
    try {
      const result = await analyzeResume(file, language);
      setProfile(result.candidateProfile);
      setStatus("done");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "");
      setStatus("error");
    }
  }

  function localizedErrorMessage(message: string) {
    const normalized = message.toLowerCase();
    if (normalized.includes("timed out") || normalized.includes("timeout")) {
      return isThai
        ? "AI ใช้เวลาวิเคราะห์นานเกินไป ลองกดวิเคราะห์อีกครั้ง หรือใช้ไฟล์ PDF/DOCX ที่เล็กและอ่านข้อความได้ชัดขึ้น"
        : "AI analysis took too long. Try again, or use a smaller/cleaner PDF or DOCX.";
    }
    if (normalized.includes("failed to fetch")) {
      return isThai
        ? "ยังเชื่อมต่อ API ไม่ได้ กรุณาตรวจว่า Go service กำลังรันอยู่ แล้วลองอีกครั้ง"
        : "The API is not reachable. Make sure the Go service is running, then try again.";
    }
    return message || (isThai ? "วิเคราะห์ไม่สำเร็จ กรุณาลองอีกครั้ง" : "Analysis failed. Please try again.");
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-10">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-[#635bff]">
          {isThai ? "วิเคราะห์เรซูเม่" : "Resume intelligence"}
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-slate-950 md:text-4xl">
          {isThai ? "เปลี่ยนเรซูเม่ให้เป็นแผนเตรียมสัมภาษณ์" : "Turn your resume into an interview plan."}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          {isThai
            ? "อัปโหลด PDF หรือ DOCX แล้วระบบจะสกัดทักษะและประสบการณ์ เพื่อนำไปสร้างคำถามสัมภาษณ์เฉพาะสำหรับคุณ"
            : "Upload a PDF or DOCX. We’ll extract your skills and experience, then use them to personalize every interview question."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-5 md:p-7">
          <button
            type="button"
            className="focus-ring flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-[#635bff] hover:bg-indigo-50/40"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setFile(event.dataTransfer.files[0] ?? null);
              setProfile(null);
              setStatus("idle");
            }}
          >
            <span className="mb-5 grid size-14 place-items-center rounded-full bg-indigo-100 text-[#635bff]">
              <UploadCloud size={25} strokeWidth={1.8} />
            </span>
            <span className="text-lg font-semibold text-slate-900">
              {isThai ? "วางเรซูเม่ของคุณที่นี่" : "Drop your resume here"}
            </span>
            <span className="mt-2 text-sm text-slate-500">
              {isThai ? "หรือคลิกเพื่อเลือกไฟล์ · PDF หรือ DOCX · ไม่เกิน 10 MB" : "or click to browse · PDF or DOCX · up to 10 MB"}
            </span>
          </button>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setProfile(null);
              setStatus("idle");
            }}
          />

          {file ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                <FileText size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                className="focus-ring rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setFile(null)}
              >
                <X size={18} />
              </button>
            </div>
          ) : null}

          <button
            type="button"
            disabled={!file || status === "uploading"}
            onClick={submit}
            className="focus-ring mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#635bff] px-5 text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Sparkles size={18} />
            {status === "uploading"
              ? isThai
                ? "กำลังวิเคราะห์เรซูเม่…"
                : "Analyzing resume…"
              : isThai
                ? "วิเคราะห์เรซูเม่"
                : "Analyze resume"}
          </button>
          {status === "error" ? (
            <p className="mt-3 text-sm text-rose-600">
              {localizedErrorMessage(errorMessage)}
            </p>
          ) : null}
        </section>

        <aside className="panel p-5 md:p-7">
          <h2 className="text-lg font-bold text-slate-950">
            {isThai ? "โปรไฟล์ผู้สมัคร" : "Candidate profile"}
          </h2>
          {profile ? (
            <div className="mt-6">
              <p className="text-2xl font-bold tracking-tight text-slate-950">
                {profile.name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {profile.career} · {profile.experienceLevel}
              </p>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  {isThai ? "ทักษะที่ตรวจพบ" : "Extracted skills"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-7 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                {profile.analysisSummary ||
                  (isThai
                    ? "โปรไฟล์พร้อมแล้ว การสัมภาษณ์ครั้งถัดไปจะใช้ทักษะเหล่านี้ในการเลือกคำถาม"
                    : "Profile ready. Your next mock interview will use these skills to choose relevant questions.")}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
              <Sparkles className="mx-auto text-slate-300" size={26} />
              <p className="mt-4 text-sm font-semibold text-slate-700">
                {isThai ? "โปรไฟล์ AI จะแสดงที่นี่" : "Your AI profile will appear here"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isThai
                  ? "ระบบจะระบุทักษะเด่น ตำแหน่งเป้าหมาย และระดับประสบการณ์ปัจจุบัน"
                  : "We’ll identify your strongest skills, target role, and current experience level."}
              </p>
            </div>
          )}
        </aside>
      </div>

      {profile ? (
        <FullAnalysis
          sections={profile.analysisSections ?? []}
          isThai={isThai}
        />
      ) : null}
    </div>
  );
}
