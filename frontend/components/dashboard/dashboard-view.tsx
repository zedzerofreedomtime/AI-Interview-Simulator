"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  CloudUpload,
  Code2,
  Container,
  Database,
  GitBranch,
  Play,
  Server,
  Target,
  TestTube2,
} from "lucide-react";
import { getDashboard } from "@/lib/api";
import { demoDashboard } from "@/lib/demo-data";
import { useLanguage } from "@/components/providers/language-provider";

const skillIcons = {
  Go: Code2,
  React: CircleDot,
  PostgreSQL: Database,
  Redis: Server,
  Docker: Container,
  "CI/CD": GitBranch,
  Testing: TestTube2,
};

const resultStyles = {
  Good: "bg-emerald-50 text-emerald-700",
  Average: "bg-amber-50 text-amber-700",
  "Needs work": "bg-rose-50 text-rose-700",
};

function ReadinessRing({ value }: { value: number }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-40 shrink-0">
      <svg className="-rotate-90" viewBox="0 0 160 160" role="img" aria-label={`${value}% ready`}>
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#eef2f7"
          strokeWidth="8"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#635bff"
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-4xl font-bold tracking-[-0.05em] text-slate-950">
        {value}%
      </span>
    </div>
  );
}

function CandidateRail({
  profile,
  isThai,
}: {
  profile: typeof demoDashboard.candidateProfile;
  isThai: boolean;
}) {
  return (
    <aside className="border-t border-slate-200 bg-white p-5 xl:min-h-screen xl:border-l xl:border-t-0 xl:p-6">
      <h2 className="text-base font-bold text-slate-950">
        {isThai ? "โปรไฟล์ผู้สมัคร" : "Candidate profile"}
      </h2>
      <div className="mt-6 flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-700">
          <BriefcaseBusiness size={20} strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-950">{profile.career}</p>
          <p className="mt-0.5 text-xs text-slate-500">{profile.experienceLevel}</p>
        </div>
      </div>

      <div className="mt-9">
        <p className="text-sm font-bold text-slate-950">
          {isThai ? "ทักษะเด่น" : "Top skills"}
        </p>
        <div className="mt-3 space-y-2.5">
          {profile.skills.map((skill) => {
            const Icon = skillIcons[skill as keyof typeof skillIcons] ?? Code2;
            return (
              <div
                key={skill}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700"
              >
                <Icon size={18} strokeWidth={1.8} className="text-[#635bff]" />
                {skill}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-9 border-t border-slate-200 pt-7">
        <p className="text-sm font-bold text-slate-950">
          {isThai ? "ทักษะที่ควรเสริม" : "Missing skills"}
        </p>
        <div className="mt-3 space-y-2.5">
          {profile.missingSkills.map((skill) => {
            const Icon = skillIcons[skill as keyof typeof skillIcons] ?? Target;
            return (
              <div
                key={skill}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700"
              >
                <Icon size={18} strokeWidth={1.8} className="text-slate-500" />
                {skill}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export function DashboardView() {
  const { isThai } = useLanguage();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    initialData: demoDashboard,
  });
  const data = query.data;

  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 px-5 py-7 md:px-8 md:py-9 2xl:px-10">
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.045em] text-slate-950 md:text-[40px] md:leading-tight">
              {isThai ? `สวัสดีตอนเช้า ${data.greetingName}` : `Good morning, ${data.greetingName}`}
            </h1>
            <p className="mt-2 text-base text-slate-500">
              {isThai
                ? "มาเตรียมทักษะสัมภาษณ์ให้พร้อมกันเถอะ"
                : "Let's sharpen your interview skills."}
            </p>
          </div>
          <Link
            href="/interview"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#635bff] px-5 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
          >
            <Play size={17} fill="currentColor" />
            {isThai ? "เริ่มจำลองสัมภาษณ์" : "Start mock interview"}
          </Link>
        </header>

        <section className="panel p-5 md:p-6">
          <h2 className="text-base font-bold text-slate-950">
            {isThai ? "ความพร้อมในการสัมภาษณ์" : "Interview readiness"}
          </h2>
          <div className="mt-3 flex flex-col items-center gap-7 md:flex-row md:gap-10">
            <ReadinessRing value={data.readiness} />
            <div className="w-full flex-1">
              <p className="text-base font-medium leading-7 text-slate-700">
                {isThai ? "คุณกำลังพัฒนาได้ดีมาก" : "You're making great progress."}
                <br />
                {isThai ? "ฝึกต่ออีกนิดเพื่อไปให้ถึง 100%" : "Keep practicing to hit 100%."}
              </p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#14b8a6]"
                  style={{ width: `${data.readiness}%` }}
                />
              </div>
              <div className="mt-2.5 grid grid-cols-5 text-[10px] font-medium text-slate-400 sm:text-xs">
                <span>{isThai ? "ยังไม่เริ่ม" : "Not started"}</span>
                <span className="text-center">{isThai ? "เริ่มต้น" : "Getting started"}</span>
                <span className="text-center">{isThai ? "มาถูกทาง" : "On track"}</span>
                <span className="text-center">{isThai ? "แข็งแกร่ง" : "Strong"}</span>
                <span className="text-right">{isThai ? "พร้อม" : "Ready"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-50 text-[#14b8a6]">
            <Target size={22} strokeWidth={1.9} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#14b8a6]">
              {isThai ? "สิ่งที่แนะนำให้ทำต่อ" : "Next recommended action"}
            </p>
            <h2 className="mt-1 text-base font-bold text-slate-950">
              {isThai ? `ฝึกตำแหน่ง ${data.targetRole}` : `${data.targetRole} practice`}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isThai
                ? "เสริมพื้นฐาน Backend ด้วยการจำลองสัมภาษณ์แบบเจาะจง"
                : "Strengthen your backend fundamentals with a focused mock interview."}
            </p>
          </div>
          <Link
            href="/interview"
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#635bff] px-4 text-sm font-semibold text-[#635bff] hover:bg-indigo-50"
          >
            {isThai ? "เริ่มฝึก" : "Start practice"}
            <ArrowRight size={16} />
          </Link>
        </section>

        <section className="panel mt-4 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-base font-bold text-slate-950">
              {isThai ? "การสัมภาษณ์ล่าสุด" : "Recent interviews"}
            </h2>
            <Link href="/reports" className="text-sm font-semibold text-[#635bff]">
              {isThai ? "ดูทั้งหมด" : "View all"}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-xs font-semibold text-slate-400">
                  <th className="px-5 py-3">{isThai ? "วันที่" : "Date"}</th>
                  <th className="px-4 py-3">{isThai ? "ตำแหน่ง" : "Role"}</th>
                  <th className="px-4 py-3">{isThai ? "ระยะเวลา" : "Duration"}</th>
                  <th className="px-4 py-3">{isThai ? "คะแนน" : "Score"}</th>
                  <th className="px-4 py-3">{isThai ? "หัวข้อ" : "Topics"}</th>
                  <th className="px-4 py-3">{isThai ? "ผลลัพธ์" : "Result"}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentInterviews.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 text-sm last:border-0">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {item.role}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{item.duration}</td>
                    <td className="px-4 py-3.5 font-bold text-[#14b8a6]">
                      {item.score}%
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {item.topics.join(", ")}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                          resultStyles[item.result]
                        }`}
                      >
                        {isThai
                          ? item.result === "Good"
                            ? "ดี"
                            : item.result === "Average"
                              ? "ปานกลาง"
                              : "ควรปรับปรุง"
                          : item.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel mt-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-950">
              {isThai ? "แผนพัฒนาอาชีพ" : "Career roadmap"}
            </h2>
            <Link href="/roadmap" className="text-sm font-semibold text-[#635bff]">
              {isThai ? "เปิดแผน" : "Open roadmap"}
            </Link>
          </div>
          <div className="relative mt-7 grid gap-6 sm:grid-cols-4 sm:gap-3 before:absolute before:left-5 before:top-5 before:h-[calc(100%-40px)] before:w-px before:bg-teal-200 sm:before:left-[12.5%] sm:before:right-[12.5%] sm:before:top-5 sm:before:h-px sm:before:w-auto">
            {data.roadmap.map((item, index) => (
              <div key={item.title} className="relative flex gap-4 sm:block sm:text-center">
                <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-teal-300 bg-white text-[#14b8a6] sm:mx-auto">
                  {index === 0 ? (
                    <Container size={17} />
                  ) : index === 1 ? (
                    <GitBranch size={17} />
                  ) : index === 2 ? (
                    <TestTube2 size={17} />
                  ) : (
                    <CloudUpload size={17} />
                  )}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-400">
                    {isThai ? `สัปดาห์ ${item.week}` : `Week ${item.week}`}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {query.isError ? (
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 size={14} />
            {isThai
              ? "กำลังแสดงข้อมูลตัวอย่างเนื่องจาก API ออฟไลน์"
              : "Showing demo data while the API is offline."}
          </p>
        ) : null}
      </div>

      <CandidateRail profile={data.candidateProfile} isThai={isThai} />
    </div>
  );
}
