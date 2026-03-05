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

  const cards = [
    {
      label: "Total Events",
      value: totalEvents,
      suffix: "",
      icon: Activity,
      gradient: "from-amber-500 to-orange-400",
    },
    {
      label: "Confirmed",
      value: confirmed,
      suffix: "",
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-emerald-400",
    },
    {
      label: "Rumors",
      value: rumors,
      suffix: "",
      icon: HelpCircle,
      gradient: "from-purple-600 to-purple-400",
    },
    {
      label: "Days Early",
      value: kpis.medianDaysEarly !== null ? medianDays : "—",
      suffix: kpis.medianDaysEarly !== null ? " days" : "",
      icon: Clock,
      gradient: "from-blue-600 to-blue-400",
    },
    {
      label: "Companies",
      value: companies,
      suffix: "",
      icon: Building2,
      gradient: "from-indigo-600 to-indigo-400",
    },
    {
      label: "Capital",
      value: formatCompactMoney(kpis.totalCapital),
      suffix: "",
      icon: DollarSign,
      gradient: "from-rose-500 to-rose-400",
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 * i }}
          className="glass rounded-2xl p-5"
        >
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}
          >
            <card.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-tight">
            {card.value}
            {card.suffix && (
              <span className="text-sm font-medium text-slate-400">
                {card.suffix}
              </span>
            )}
          </p>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1 block">
            {card.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
