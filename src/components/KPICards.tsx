"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  HelpCircle,
  Clock,
  Building2,
  DollarSign,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { KPIDataExtended } from "@/utils/calculations";
import { formatCompactMoney } from "@/utils/calculations";

interface Props {
  kpis: KPIDataExtended;
}

export default function KPICards({ kpis }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  const totalEvents = useCountUp({ end: kpis.totalEvents, enabled: inView });
  const confirmed = useCountUp({ end: kpis.confirmedEvents, enabled: inView, delay: 100 });
  const rumors = useCountUp({ end: kpis.rumors, enabled: inView, delay: 200 });
  const medianDays = useCountUp({
    end: kpis.medianDaysEarly ?? 0,
    enabled: inView && kpis.medianDaysEarly !== null,
    delay: 300,
  });
  const companies = useCountUp({ end: kpis.companiesTracked, enabled: inView, delay: 400 });

  const primary = [
    {
      label: "Total Events",
      value: totalEvents,
      suffix: "",
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Confirmed",
      value: confirmed,
      suffix: "",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Rumors",
      value: rumors,
      suffix: "",
      icon: HelpCircle,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Median Days Early",
      value: kpis.medianDaysEarly !== null ? medianDays : "—",
      suffix: kpis.medianDaysEarly !== null ? " days" : "",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  const secondary = [
    {
      label: "Companies Tracked",
      value: companies,
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Capital",
      value: formatCompactMoney(kpis.totalCapital),
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div ref={ref} className="space-y-4 mb-8">
      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {primary.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 * i }}
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
              {card.value}
              {card.suffix && (
                <span className="text-base font-normal text-slate-400 ml-1">
                  {card.suffix}
                </span>
              )}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 gap-4">
        {secondary.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 + 0.05 * i }}
            whileHover={{ y: -2 }}
            className="glass p-4 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}
            >
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <p className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
