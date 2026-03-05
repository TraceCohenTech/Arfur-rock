"use client";

import { FilterState, Scope } from "@/lib/types";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { scopeLabel } from "@/lib/utils";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const SCOPES: Scope[] = [
  "called_vs_announced",
  "rumor_unconfirmed",
  "market_datapoint",
];

export default function FilterBar({ filters, onChange }: Props) {
  const hasFilters =
    filters.scopes.length > 0 ||
    filters.confirmedOnly ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.search !== "";

  const toggleScope = (scope: Scope) => {
    const next = filters.scopes.includes(scope)
      ? filters.scopes.filter((s) => s !== scope)
      : [...filters.scopes, scope];
    onChange({ ...filters, scopes: next });
  };

  return (
    <div className="glass-static p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, notes, source..."
            value={filters.search}
            onChange={(e) =>
              onChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>

        {/* Scope toggles */}
        <div className="flex gap-1.5">
          {SCOPES.map((scope) => {
            const active = filters.scopes.includes(scope);
            return (
              <button
                key={scope}
                onClick={() => toggleScope(scope)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {scopeLabel(scope)}
              </button>
            );
          })}
        </div>

        {/* Confirmed toggle */}
        <button
          onClick={() =>
            onChange({ ...filters, confirmedOnly: !filters.confirmedOnly })
          }
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            filters.confirmedOnly
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
          }`}
        >
          Confirmed only
        </button>

        {/* Date range */}
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) =>
            onChange({ ...filters, dateFrom: e.target.value })
          }
          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
        />
        <span className="text-slate-400 text-xs">to</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) =>
            onChange({ ...filters, dateTo: e.target.value })
          }
          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
        />

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() =>
              onChange({
                scopes: [],
                confirmedOnly: false,
                dateFrom: "",
                dateTo: "",
                search: "",
              })
            }
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
