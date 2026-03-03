"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { CompanyIntel } from "@/lib/parseCompanyIntel";
import {
  TrendingUp,
  DollarSign,
  Users,
  Rocket,
  CheckCircle2,
  Search,
} from "lucide-react";

interface Props {
  data: CompanyIntel[];
}

export default function CompanyIntelGrid({ data }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [filter, setFilter] = useState<"all" | "raising" | "closed">("all");
  const [search, setSearch] = useState("");

  const filtered = data.filter((c) => {
    if (filter === "raising" && !c.nowRaising) return false;
    if (filter === "closed" && c.nowRaising) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.company.toLowerCase().includes(q) ||
        c.focus.toLowerCase().includes(q) ||
        c.investors.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies, focus, investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {(
            [
              { key: "all", label: "All", count: data.length },
              {
                key: "raising",
                label: "Now Raising",
                count: data.filter((c) => c.nowRaising).length,
              },
              {
                key: "closed",
                label: "Closed",
                count: data.filter((c) => !c.nowRaising).length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                filter === tab.key
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {tab.label}{" "}
              <span className="text-[10px] opacity-70">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((company, i) => (
          <CompanyCard key={company.company} company={company} index={i} inView={inView} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">
          No companies match your filters
        </div>
      )}
    </motion.div>
  );
}

function CompanyCard({
  company,
  index,
  inView,
}: {
  company: CompanyIntel;
  index: number;
  inView: boolean;
}) {
  const name = company.company.split("(")[0].trim();
  const handle = company.company.match(/@\w+/)?.[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="glass p-4 relative overflow-hidden group"
    >
      {/* Status indicator */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${
          company.nowRaising
            ? "bg-gradient-to-r from-amber-400 to-orange-500"
            : "bg-gradient-to-r from-emerald-400 to-green-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
            {name}
          </h3>
          {handle && (
            <span className="text-xs text-slate-400">{handle}</span>
          )}
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${
            company.nowRaising
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {company.nowRaising ? "Raising" : "Closed"}
        </span>
      </div>

      {/* Focus */}
      <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
        {company.focus}
      </p>

      {/* Metrics */}
      <div className="space-y-1.5">
        {company.arr && company.arr !== "Not specified" && (
          <MetricRow
            icon={<DollarSign className="w-3 h-3" />}
            label="Revenue"
            value={company.arr}
            color="emerald"
          />
        )}
        {company.growth && company.growth !== "Not specified" && (
          <MetricRow
            icon={<TrendingUp className="w-3 h-3" />}
            label="Growth"
            value={company.growth}
            color="purple"
          />
        )}
        {company.fundingRound &&
          company.fundingRound !== "Not specified" &&
          company.fundingRound !== "Unspecified (likely raising)" && (
            <MetricRow
              icon={<Rocket className="w-3 h-3" />}
              label="Round"
              value={company.fundingRound}
              color="amber"
            />
          )}
        {company.investors &&
          company.investors !== "Not specified" && (
            <MetricRow
              icon={<Users className="w-3 h-3" />}
              label="Investors"
              value={company.investors}
              color="blue"
            />
          )}
      </div>

      {/* Date */}
      <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-300">
        Called {company.tweetDate}
      </div>
    </motion.div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <div className="flex items-start gap-2">
      <span className={`shrink-0 mt-0.5 p-1 rounded ${c}`}>{icon}</span>
      <div className="min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
          {label}
        </span>
        <p className="text-xs text-slate-700 leading-snug truncate">{value}</p>
      </div>
    </div>
  );
}
