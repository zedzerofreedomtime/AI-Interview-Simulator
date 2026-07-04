"use client";

import { ArrowUpRight, Download, TrendingUp } from "lucide-react";
import { demoInterviews } from "@/lib/demo-data";
import { useLanguage } from "@/components/providers/language-provider";

export default function ReportsPage() {
  const { isThai } = useLanguage();
  const average = Math.round(
    demoInterviews.reduce((total, item) => total + item.score, 0) /
      demoInterviews.length,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#635bff]">{isThai ? "ผลการฝึก" : "Performance"}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 md:text-4xl">
            {isThai ? "รายงานการสัมภาษณ์" : "Interview reports"}
          </h1>
          <p className="mt-3 text-slate-500">
            {isThai ? "ติดตามความก้าวหน้าและดูสิ่งที่ควรพัฒนาต่อ" : "Track your progress and see exactly what to improve next."}
          </p>
        </div>
        <button className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Download size={17} />
          {isThai ? "ส่งออกรายงาน" : "Export report"}
        </button>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          [isThai ? "คะแนนเฉลี่ย" : "Average score", `${average}%`, isThai ? "+8% เดือนนี้" : "+8% this month"],
          [isThai ? "สัมภาษณ์ที่ทำเสร็จ" : "Interviews completed", "12", isThai ? "4 ครั้งเดือนนี้" : "4 this month"],
          [isThai ? "ทักษะที่แข็งแกร่งที่สุด" : "Strongest skill", "Go", isThai ? "เฉลี่ย 86%" : "86% average"],
        ].map(([label, value, note]) => (
          <div key={label} className="panel p-5">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {value}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={14} />
              {note}
            </p>
          </div>
        ))}
      </section>

      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-950">{isThai ? "ประวัติการสัมภาษณ์" : "Interview history"}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Topics</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {demoInterviews.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 text-sm">
                  <td className="px-5 py-4 text-slate-500">{item.date}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {item.role}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {item.topics.join(", ")}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{item.duration}</td>
                  <td className="px-5 py-4 font-bold text-[#14b8a6]">
                    {item.score}%
                  </td>
                  <td className="px-5 py-4">
                    <ArrowUpRight size={17} className="text-slate-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
