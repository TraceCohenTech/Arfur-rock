"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Props {
  data: SummaryRow[];
}

export default function SummaryTable({ data }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="glass-static overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="sticky top-0 bg-white z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-8"></th>
              <th className="sticky top-0 bg-white z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[200px]">
                Company
              </th>
              <th className="sticky top-0 bg-white z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[110px]">
                Call Date
              </th>
              <th className="sticky top-0 bg-white z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <SummaryTableRow
                key={`${row.company}-${i}`}
                row={row}
                index={i}
                isExpanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryTableRow({
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
    <>
      <tr
        onClick={onToggle}
        className="border-b border-slate-50 hover:bg-amber-50/40 cursor-pointer transition-colors"
      >
        <td className="px-4 py-3">
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </motion.div>
        </td>
        <td className="px-4 py-3 font-medium text-slate-900">
          {row.company}
        </td>
        <td className="px-4 py-3 text-slate-600 tabular-nums">
          {formatDate(row.call_date)}
        </td>
        <td className="px-4 py-3 text-slate-600 max-w-[400px] truncate">
          {row.call_note || "—"}
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={4}>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-3">
                    {row.call_note}
                  </p>
                  <div className="flex gap-6 text-xs text-slate-400">
                    {row.round_amount && (
                      <span>
                        <strong className="text-slate-600">Amount:</strong>{" "}
                        {row.round_amount}
                      </span>
                    )}
                    {row.valuation && (
                      <span>
                        <strong className="text-slate-600">Valuation:</strong>{" "}
                        {row.valuation}
                      </span>
                    )}
                    {row.round_stage && (
                      <span>
                        <strong className="text-slate-600">Stage:</strong>{" "}
                        {row.round_stage}
                      </span>
                    )}
                    {row.call_source_type && (
                      <span>
                        <strong className="text-slate-600">Source:</strong>{" "}
                        {row.call_source_type}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
