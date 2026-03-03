"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { TopRound } from "@/lib/types";
import { Trophy } from "lucide-react";

interface Props {
  data: TopRound[];
}

const rankColors = [
  "from-amber-500 to-orange-500 text-white shadow-amber-200",
  "from-slate-300 to-slate-400 text-white shadow-slate-200",
  "from-orange-400 to-amber-600 text-white shadow-orange-200",
];

export default function TopRoundsList({ data }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  if (data.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static overflow-hidden"
    >
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

      <div className="p-5 space-y-3">
        {data.map((round, i) => (
          <div key={`${round.company}-${i}`} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br shadow-sm shrink-0 ${
                    i < 3 ? rankColors[i] : "from-slate-100 to-slate-200 text-slate-500"
                  }`}
                >
                  {i < 3 ? (
                    <Trophy className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-bold tabular-nums">{i + 1}</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {round.company}
                </span>
                {round.stage && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200/50 font-medium">
                    {round.stage}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg tabular-nums">
                {round.amountLabel}
              </span>
            </div>
            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden ml-10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: i < 3
                    ? `linear-gradient(90deg, #f59e0b, #ea580c)`
                    : `linear-gradient(90deg, #fbbf24, #f59e0b)`,
                }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${round.pct}%` } : { width: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.1 * i,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
