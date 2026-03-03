"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Layers, DollarSign, TrendingUp, Clock, FileText, ExternalLink } from "lucide-react";
import { EventRow } from "@/lib/types";
import { formatDate, scopeLabel } from "@/lib/utils";

interface Props {
  row: EventRow | null;
  onClose: () => void;
}

const scopeBadge: Record<string, string> = {
  called_vs_announced: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  rumor_unconfirmed: "bg-gradient-to-r from-violet-500 to-purple-500 text-white",
  market_datapoint: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
};

export default function DetailDrawer({ row, onClose }: Props) {
  return (
    <AnimatePresence>
      {row && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Gradient header */}
            <div className="hero-gradient px-6 pt-6 pb-8 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full mb-3 ${scopeBadge[row.scope] || "bg-white/20 text-white"}`}
                >
                  {scopeLabel(row.scope)}
                </span>
                <h2 className="text-2xl font-bold text-white">
                  {row.company}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Key metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  icon={<Calendar className="w-4 h-4" />}
                  label="Call Date"
                  value={formatDate(row.call_date)}
                  color="amber"
                />
                <MetricCard
                  icon={<Layers className="w-4 h-4" />}
                  label="Stage"
                  value={row.round_stage || "—"}
                  color="blue"
                />
                <MetricCard
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Amount"
                  value={row.round_amount || "—"}
                  color="emerald"
                />
                <MetricCard
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Valuation"
                  value={row.valuation || "—"}
                  color="purple"
                />
              </div>

              {/* Days Early callout */}
              {row.delta_days_call_to_announce !== null && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 ring-1 ring-amber-200/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-amber-700 tabular-nums">
                      {Math.round(row.delta_days_call_to_announce)} days
                    </div>
                    <div className="text-xs text-amber-600/70">called before announcement</div>
                  </div>
                </div>
              )}

              {/* Announced date */}
              {row.official_announce_date && (
                <MetricCard
                  icon={<Calendar className="w-4 h-4" />}
                  label="Announced Date"
                  value={formatDate(row.official_announce_date)}
                  color="green"
                  fullWidth
                />
              )}

              {/* Call Note */}
              {row.call_note && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Call Note
                    </h3>
                  </div>
                  <div className="chart-insight py-3 px-4 rounded-r-xl">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {row.call_note}
                    </p>
                  </div>
                </div>
              )}

              {/* Announce Note */}
              {row.announce_note && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Announce Note
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-emerald-50/50 rounded-xl p-4">
                    {row.announce_note}
                  </p>
                </div>
              )}

              {/* Source */}
              {row.official_announce_source && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Source
                    </h3>
                  </div>
                  <p className="text-sm text-blue-600 leading-relaxed break-all">
                    {row.official_announce_source}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  fullWidth?: boolean;
}) {
  const colorMap: Record<string, { bg: string; iconBg: string; text: string }> = {
    amber: { bg: "bg-amber-50", iconBg: "text-amber-500", text: "text-amber-900" },
    blue: { bg: "bg-blue-50", iconBg: "text-blue-500", text: "text-blue-900" },
    emerald: { bg: "bg-emerald-50", iconBg: "text-emerald-500", text: "text-emerald-900" },
    purple: { bg: "bg-purple-50", iconBg: "text-purple-500", text: "text-purple-900" },
    green: { bg: "bg-green-50", iconBg: "text-green-500", text: "text-green-900" },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <div className={`${c.bg} rounded-xl p-3 ${fullWidth ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className={c.iconBg}>{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className={`text-sm font-semibold ${c.text}`}>{value}</p>
    </div>
  );
}
