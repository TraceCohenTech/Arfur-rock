"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ChevronRight, DollarSign, Layers, Radio, FileText } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface Props {
  data: SummaryRow[];
}

export default function SummaryTable({ data }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static overflow-hidden"
    >
      {/* Orange accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400" />

      <div className="max-h-[700px] overflow-y-auto">
        <div className="divide-y divide-slate-100">
          {data.map((row, i) => (
            <SummaryCard
              key={`${row.company}-${i}`}
              row={row}
              index={i}
              isExpanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({
  row,
  index,
  isExpanded,
  onToggle,
}: {
  row: SummaryRow;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="group">
      <div
        onClick={onToggle}
        className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-all ${
          isExpanded
            ? "bg-gradient-to-r from-amber-50 to-orange-50/50"
            : "hover:bg-gradient-to-r hover:from-amber-50/40 hover:to-transparent"
        }`}
      >
        {/* Rank number */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 shrink-0">
          <span className="text-xs font-bold text-amber-700 tabular-nums">
            {index + 1}
          </span>
        </div>

        {/* Company + meta row */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
              {row.company}
            </span>
            {row.round_stage && (
              <span className="shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200/50">
                {row.round_stage}
              </span>
            )}
            {row.round_amount && (
              <span className="shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50">
                {row.round_amount}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 truncate">
            {formatDate(row.call_date)}
            {row.call_note && (
              <span className="ml-2 text-slate-400">
                — {row.call_note.slice(0, 80)}{row.call_note.length > 80 ? "..." : ""}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronRight className={`w-5 h-5 transition-colors ${isExpanded ? "text-amber-500" : "text-slate-300 group-hover:text-slate-400"}`} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 ml-12">
              {/* Detail pills */}
              <div className="flex flex-wrap gap-3 mb-4">
                {row.round_amount && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700">{row.round_amount}</span>
                  </div>
                )}
                {row.valuation && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 ring-1 ring-blue-100">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-blue-700">{row.valuation}</span>
                  </div>
                )}
                {row.round_stage && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 ring-1 ring-amber-100">
                    <Radio className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">{row.round_stage}</span>
                  </div>
                )}
                {row.call_source_type && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 ring-1 ring-violet-100">
                    <FileText className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-xs font-medium text-violet-700">{row.call_source_type}</span>
                  </div>
                )}
              </div>

              {/* Note */}
              {row.call_note && (
                <div className="chart-insight py-3 px-4 rounded-r-xl">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {row.call_note}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
