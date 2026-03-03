"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { TopRound } from "@/lib/types";

interface Props {
  data: TopRound[];
}

export default function TopRoundsList({ data }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  if (data.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static p-5"
    >
      <div className="space-y-3">
        {data.map((round, i) => (
          <div key={`${round.company}-${i}`} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 tabular-nums w-5">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {round.company}
                </span>
                {round.stage && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                    {round.stage}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700 tabular-nums">
                {round.amountLabel}
              </span>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, #f59e0b, #d97706)`,
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
