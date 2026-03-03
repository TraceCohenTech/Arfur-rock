"use client";

import { motion } from "framer-motion";
import { EventRow, SortKey, SortDir } from "@/lib/types";
import { formatDate, scopeLabel } from "@/lib/utils";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface Props {
  data: EventRow[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onRowClick: (row: EventRow) => void;
}

const scopeBadge: Record<string, string> = {
  called_vs_announced: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  rumor_unconfirmed: "bg-gradient-to-r from-violet-500 to-purple-500 text-white",
  market_datapoint: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
};

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "company", label: "Company", className: "min-w-[160px]" },
  { key: "scope", label: "Scope", className: "min-w-[140px]" },
  { key: "call_date", label: "Call Date", className: "min-w-[100px]" },
  { key: "round_stage", label: "Stage", className: "min-w-[90px]" },
  { key: "round_amount", label: "Amount", className: "min-w-[100px]" },
  { key: "valuation", label: "Valuation", className: "min-w-[100px]" },
  {
    key: "delta_days_call_to_announce",
    label: "Days Early",
    className: "min-w-[100px]",
  },
  {
    key: "official_announce_source",
    label: "Source",
    className: "min-w-[80px]",
  },
];

function DaysEarlyBadge({ days }: { days: number }) {
  const rounded = Math.round(days);
  let classes = "";
  if (days > 90) {
    classes = "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200";
  } else if (days > 30) {
    classes = "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
  } else if (days > 0) {
    classes = "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  } else {
    classes = "bg-slate-100 text-slate-500";
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full tabular-nums ${classes}`}>
      {rounded}d
    </span>
  );
}

function AmountCell({ value }: { value: string }) {
  if (!value) return <span className="text-slate-300">—</span>;
  return (
    <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
      {value}
    </span>
  );
}

function StageChip({ stage }: { stage: string }) {
  if (!stage) return <span className="text-slate-300">—</span>;
  const stageColors: Record<string, string> = {
    seed: "bg-green-50 text-green-700 ring-green-200",
    "pre-seed": "bg-lime-50 text-lime-700 ring-lime-200",
    "series a": "bg-blue-50 text-blue-700 ring-blue-200",
    "series b": "bg-indigo-50 text-indigo-700 ring-indigo-200",
    "series c": "bg-purple-50 text-purple-700 ring-purple-200",
    "series d": "bg-pink-50 text-pink-700 ring-pink-200",
    "series e": "bg-rose-50 text-rose-700 ring-rose-200",
  };
  const lower = stage.toLowerCase();
  const color = Object.entries(stageColors).find(([k]) => lower.includes(k))?.[1]
    || "bg-slate-50 text-slate-600 ring-slate-200";
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md ring-1 ${color}`}>
      {stage}
    </span>
  );
}

export default function EventsTable({
  data,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static overflow-hidden"
    >
      {/* Amber accent bar at top */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-amber-50/80 to-orange-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className={`sticky top-0 bg-gradient-to-r from-amber-50/80 to-orange-50/50 backdrop-blur-sm px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-amber-800 cursor-pointer hover:text-amber-600 transition-colors select-none z-10 ${col.className || ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-amber-500">
                        {sortDir === "asc" ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center"
                >
                  <div className="text-slate-400 text-sm">No events match your filters</div>
                  <div className="text-slate-300 text-xs mt-1">Try adjusting your search or clearing filters</div>
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr
                key={`${row.company}-${i}`}
                onClick={() => onRowClick(row)}
                className="border-b border-slate-100/80 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 cursor-pointer transition-all group"
              >
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {row.company}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full ${scopeBadge[row.scope] || "bg-slate-100 text-slate-600"}`}
                  >
                    {scopeLabel(row.scope)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 tabular-nums text-xs">
                  {formatDate(row.call_date)}
                </td>
                <td className="px-4 py-3.5">
                  <StageChip stage={row.round_stage} />
                </td>
                <td className="px-4 py-3.5">
                  <AmountCell value={row.round_amount} />
                </td>
                <td className="px-4 py-3.5 text-slate-500 tabular-nums text-xs">
                  {row.valuation || <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3.5">
                  {row.delta_days_call_to_announce !== null ? (
                    <DaysEarlyBadge days={row.delta_days_call_to_announce} />
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  {row.official_announce_source ? (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800">
                      <ExternalLink className="w-3 h-3" />
                      Link
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
