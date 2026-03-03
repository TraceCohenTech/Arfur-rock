"use client";

import { motion } from "framer-motion";

interface Props {
  active: "events" | "summary";
  onChange: (tab: "events" | "summary") => void;
  eventCount: number;
  summaryCount: number;
}

export default function TabBar({
  active,
  onChange,
  eventCount,
  summaryCount,
}: Props) {
  const tabs = [
    { key: "events" as const, label: "Events", count: eventCount },
    {
      key: "summary" as const,
      label: "34 Startup Summary",
      count: summaryCount,
    },
  ];

  return (
    <div className="flex gap-1 mb-6 bg-white/60 backdrop-blur-sm p-1 rounded-xl inline-flex border border-slate-200/60">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="relative px-5 py-2 text-sm font-medium rounded-lg transition-colors"
        >
          {active === tab.key && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/80"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span
            className={`relative z-10 ${active === tab.key ? "text-slate-900" : "text-slate-500"}`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-xs ${active === tab.key ? "text-slate-400" : "text-slate-300"}`}
            >
              {tab.count}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
