"use client";

import { EventRow, SortKey, SortDir } from "@/lib/types";
import { formatDate, scopeLabel, scopeColor } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  data: EventRow[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onRowClick: (row: EventRow) => void;
}

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "company", label: "Company", className: "min-w-[140px]" },
  { key: "scope", label: "Scope", className: "min-w-[130px]" },
  { key: "call_date", label: "Call Date", className: "min-w-[100px]" },
  { key: "round_stage", label: "Stage", className: "min-w-[100px]" },
  { key: "round_amount", label: "Amount", className: "min-w-[90px]" },
  { key: "valuation", label: "Valuation", className: "min-w-[100px]" },
  {
    key: "official_announce_date",
    label: "Announced",
    className: "min-w-[100px]",
  },
  {
    key: "delta_days_call_to_announce",
    label: "Days Early",
    className: "min-w-[90px]",
  },
  {
    key: "official_announce_source",
    label: "Source",
    className: "min-w-[120px]",
  },
];

export default function EventsTable({
  data,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
}: Props) {
  return (
    <div className="glass-static overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className={`sticky top-0 bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 transition-colors select-none ${col.className || ""}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
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
                  className="px-4 py-12 text-center text-slate-400"
                >
                  No events match your filters
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr
                key={`${row.company}-${i}`}
                onClick={() => onRowClick(row)}
                className="border-b border-slate-50 hover:bg-amber-50/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {row.company}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md ${scopeColor(row.scope)}`}
                  >
                    {scopeLabel(row.scope)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {formatDate(row.call_date)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.round_stage || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {row.round_amount || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {row.valuation || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {formatDate(row.official_announce_date)}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {row.delta_days_call_to_announce !== null ? (
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                        row.delta_days_call_to_announce > 30
                          ? "bg-amber-100 text-amber-700"
                          : row.delta_days_call_to_announce > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {Math.round(row.delta_days_call_to_announce)}d
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                  {row.official_announce_source || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
