"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EventRow } from "@/lib/types";
import { formatDate, scopeLabel, scopeColor } from "@/lib/utils";

interface Props {
  row: EventRow | null;
  onClose: () => void;
}

export default function DetailDrawer({ row, onClose }: Props) {
  return (
    <AnimatePresence>
      {row && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {row.company}
                  </h2>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-md ${scopeColor(row.scope)}`}
                  >
                    {scopeLabel(row.scope)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Details grid */}
              <div className="space-y-5">
                <Section label="Call Date">
                  {formatDate(row.call_date)}
                </Section>
                <Section label="Round Stage">
                  {row.round_stage || "—"}
                </Section>
                <Section label="Amount">
                  {row.round_amount || "—"}
                </Section>
                <Section label="Valuation">
                  {row.valuation || "—"}
                </Section>
                <Section label="Announced Date">
                  {formatDate(row.official_announce_date)}
                </Section>
                {row.delta_days_call_to_announce !== null && (
                  <Section label="Days Early">
                    <span className="text-amber-600 font-semibold">
                      {Math.round(row.delta_days_call_to_announce)} days
                    </span>
                  </Section>
                )}

                {/* Long text fields */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Call Note
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {row.call_note || "—"}
                  </p>
                </div>

                {row.announce_note && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Announce Note
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {row.announce_note}
                    </p>
                  </div>
                )}

                {row.official_announce_source && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Announce Source
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {row.official_announce_source}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="text-sm text-slate-800 mt-0.5">{children}</p>
    </div>
  );
}
