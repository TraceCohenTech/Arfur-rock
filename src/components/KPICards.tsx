"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  HelpCircle,
  Clock,
} from "lucide-react";
import { KPIData } from "@/lib/types";

interface Props {
  kpis: KPIData;
}

const cards = [
  {
    key: "totalEvents" as const,
    label: "Total Events",
    icon: Activity,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "confirmedEvents" as const,
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "rumors" as const,
    label: "Rumors",
    icon: HelpCircle,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "medianDaysEarly" as const,
    label: "Median Days Early",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export default function KPICards({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const val =
          card.key === "medianDaysEarly"
            ? kpis.medianDaysEarly !== null
              ? kpis.medianDaysEarly
              : "—"
            : kpis[card.key];

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            whileHover={{ y: -4 }}
            className="glass p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {typeof val === "number" ? Math.round(val) : val}
              {card.key === "medianDaysEarly" && typeof val === "number" && (
                <span className="text-base font-normal text-slate-400 ml-1">
                  days
                </span>
              )}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
