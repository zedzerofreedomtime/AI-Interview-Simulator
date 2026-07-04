"use client";

import { Check, Circle, Play, Rocket } from "lucide-react";
import { roadmap } from "@/lib/demo-data";
import { useLanguage } from "@/components/providers/language-provider";

export default function RoadmapPage() {
  const { isThai } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-10">
      <header className="mb-9">
        <p className="text-sm font-semibold text-[#635bff]">{isThai ? "โค้ชอาชีพ" : "Career coach"}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 md:text-4xl">
          {isThai ? "แผนพัฒนาสู่ Backend Developer" : "Your Backend Developer roadmap"}
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
          {isThai
            ? "แผนสี่สัปดาห์ที่สร้างจากเรซูเม่ ผลการสัมภาษณ์ และทักษะที่จำเป็นสำหรับตำแหน่งเป้าหมาย"
            : "A focused four-week plan built from your resume, interview results, and the skills expected for your target role."}
        </p>
      </header>

      <section className="panel mb-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-indigo-100 text-[#635bff]">
            <Rocket size={21} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-500">{isThai ? "ความเหมาะสมปัจจุบัน" : "Current match"}</p>
            <p className="text-2xl font-bold text-slate-950">78%</p>
          </div>
        </div>
        <div className="w-full max-w-md">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[78%] rounded-full bg-[#14b8a6]" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {isThai ? "ทำแผนนี้ให้ครบเพื่อเติมทักษะที่มีผลต่อเป้าหมายมากที่สุด" : "Complete this plan to close the highest-impact skill gaps."}
          </p>
        </div>
      </section>

      <div className="relative space-y-4 before:absolute before:bottom-12 before:left-[25px] before:top-12 before:w-px before:bg-slate-200">
        {roadmap.map((item, index) => (
          <article key={item.title} className="panel relative flex gap-5 p-5 md:p-6">
            <span
              className={`relative z-10 grid size-12 shrink-0 place-items-center rounded-full border ${
                index === 0
                  ? "border-[#635bff] bg-[#635bff] text-white"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              {index === 0 ? <Play size={17} fill="currentColor" /> : <Circle size={17} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    {isThai ? `สัปดาห์ ${index + 1}` : `Week ${index + 1}`}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">
                    {item.title}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {item.hours} hours
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {item.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <Check size={15} className="text-[#14b8a6]" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
