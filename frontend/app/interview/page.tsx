"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Mic, Send, TimerReset } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createInterview, evaluateAnswer } from "@/lib/api";
import type { AnswerEvaluation } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

export default function InterviewPage() {
  const { isThai, language, isLanguageReady } = useLanguage();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const interviewQuery = useQuery({
    queryKey: ["interview-session", "Backend Developer", language],
    queryFn: () =>
      createInterview(
        "Backend Developer",
        ["Go", "PostgreSQL", "Redis", "API Design"],
        language,
        4,
      ),
    enabled: isLanguageReady,
    staleTime: Number.POSITIVE_INFINITY,
  });
  const questions = interviewQuery.data?.questions ?? [];
  const question = questions[questionIndex];
  const progress = questions.length
    ? ((questionIndex + 1) / questions.length) * 100
    : 0;

  const scoreTone = useMemo(() => {
    if (!evaluation) return "text-slate-900";
    if (evaluation.score >= 80) return "text-emerald-600";
    if (evaluation.score >= 60) return "text-amber-600";
    return "text-rose-600";
  }, [evaluation]);

  async function submitAnswer() {
    if (!answer.trim() || !question || !interviewQuery.data) return;
    setLoading(true);
    setSubmitError("");
    try {
      const result = await evaluateAnswer(
        interviewQuery.data.id,
        question.id,
        answer,
        language,
      );
      setEvaluation(result);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Answer evaluation failed",
      );
    } finally {
      setLoading(false);
    }
  }

  function nextQuestion() {
    if (questionIndex >= questions.length - 1) return;
    setQuestionIndex((current) => current + 1);
    setAnswer("");
    setEvaluation(null);
    setSubmitError("");
  }

  if (!isLanguageReady || interviewQuery.isPending) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5 text-center">
        <p className="text-sm font-semibold text-slate-600">
          {isThai ? "กำลังสร้างชุดคำถามสัมภาษณ์ด้วย AI…" : "Creating your AI interview…"}
        </p>
      </div>
    );
  }

  if (interviewQuery.isError || !question) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5 text-center">
        <div>
          <p className="font-semibold text-rose-600">
            {isThai ? "สร้างชุดสัมภาษณ์ไม่สำเร็จ" : "Unable to create the interview"}
          </p>
          <button
            type="button"
            onClick={() => interviewQuery.refetch()}
            className="focus-ring mt-4 rounded-xl bg-[#635bff] px-5 py-3 text-sm font-semibold text-white"
          >
            {isThai ? "ลองอีกครั้ง" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-5 py-7 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#635bff]">
              {isThai ? "Backend Developer · สัมภาษณ์แบบปรับระดับ" : "Backend Developer · Adaptive interview"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950">
              {isThai
                ? `คำถาม ${questionIndex + 1} จาก ${questions.length}`
                : `Question ${questionIndex + 1} of ${questions.length}`}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <TimerReset size={17} />
            {isThai ? "เหลือเวลา 32:18" : "32:18 remaining"}
          </div>
        </header>

        <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#635bff] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <main className="panel p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {question.category}
              </span>
              <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                {question.difficulty}
              </span>
            </div>
            <h2 className="max-w-3xl text-2xl font-bold leading-9 tracking-[-0.02em] text-slate-950 md:text-3xl md:leading-11">
              {question.text}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              {isThai
                ? "จัดโครงสร้างคำตอบให้ชัดเจน อธิบายแนวคิด ข้อแลกเปลี่ยน และปิดท้ายด้วยตัวอย่างที่ใช้งานจริง"
                : "Structure your answer clearly. Explain the concept, discuss the trade-offs, and finish with a practical example."}
            </p>

            <div className="mt-8">
              <label
                htmlFor="answer"
                className="mb-3 block text-sm font-semibold text-slate-800"
              >
                {isThai ? "คำตอบของคุณ" : "Your answer"}
              </label>
              <textarea
                id="answer"
                rows={10}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={isThai ? "เริ่มพิมพ์คำตอบของคุณ…" : "Start typing your answer…"}
                className="focus-ring w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-[15px] leading-7 text-slate-900 placeholder:text-slate-400"
              />
              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Mic size={17} />
                  {isThai ? "ตอบด้วยเสียง" : "Answer with voice"}
                </button>
                <button
                  type="button"
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#635bff] px-5 text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:opacity-45"
                >
                  <Send size={16} />
                  {loading
                    ? isThai
                      ? "กำลังประเมิน…"
                      : "Evaluating…"
                    : isThai
                      ? "ส่งคำตอบ"
                      : "Submit answer"}
                </button>
              </div>
              {submitError ? (
                <p className="mt-3 text-sm text-rose-600">{submitError}</p>
              ) : null}
            </div>
          </main>

          <aside className="panel h-fit p-6">
            <h2 className="text-base font-bold text-slate-950">
              {isThai ? "การประเมินโดย AI" : "AI evaluation"}
            </h2>
            {evaluation ? (
              <>
                <div className="mt-6 flex items-end gap-2">
                  <strong className={`text-5xl tracking-[-0.05em] ${scoreTone}`}>
                    {evaluation.score}
                  </strong>
                  <span className="pb-1 text-sm font-semibold text-slate-400">
                    / 100
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    ["Accuracy", evaluation.accuracy],
                    ["Technical depth", evaluation.technicalDepth],
                    ["Communication", evaluation.communication],
                    ["Problem solving", evaluation.problemSolving],
                    ["Completeness", evaluation.completeness],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div className="mb-1.5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">
                      {isThai
                        ? {
                            Accuracy: "ความถูกต้อง",
                            "Technical depth": "ความลึกด้านเทคนิค",
                            Communication: "การสื่อสาร",
                            "Problem solving": "การแก้ปัญหา",
                            Completeness: "ความครบถ้วน",
                          }[String(label)]
                        : label}
                    </span>
                        <span className="text-slate-900">{value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#14b8a6]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {isThai ? "คำแนะนำ" : "Feedback"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {evaluation.feedback}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={questionIndex === questions.length - 1}
                  className="focus-ring mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#635bff] text-sm font-semibold text-[#635bff] transition hover:bg-indigo-50 disabled:opacity-40"
                >
                  {isThai ? "คำถามถัดไป" : "Next question"}
                  <ArrowRight size={17} />
                </button>
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center">
                <CheckCircle2 className="mx-auto text-slate-300" size={28} />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  {isThai ? "ส่งคำตอบเพื่อดูคะแนน" : "Submit an answer to see your score"}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {isThai
                    ? "ระบบจะให้คะแนนความถูกต้อง ความลึก การสื่อสาร การแก้ปัญหา และความครบถ้วนแยกกัน"
                    : "Accuracy, depth, communication, problem solving, and completeness are scored separately."}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
