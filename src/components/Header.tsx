"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { KPIDataExtended } from "@/utils/calculations";
import { formatCompactMoney } from "@/utils/calculations";

interface Props {
  kpis: KPIDataExtended;
}

export default function Header({ kpis }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  const totalEvents = useCountUp({ end: kpis.totalEvents, enabled: inView, duration: 2000 });
  const companiesTracked = useCountUp({ end: kpis.companiesTracked, enabled: inView, delay: 200 });
  const confirmedCalls = useCountUp({ end: kpis.confirmedEvents, enabled: inView, delay: 400 });
  const medianDays = useCountUp({
    end: kpis.medianDaysEarly ?? 0,
    enabled: inView && kpis.medianDaysEarly !== null,
    delay: 600,
  });

  const pills = [
    { label: "Companies Tracked", value: companiesTracked },
    { label: "Confirmed Calls", value: confirmedCalls },
    {
      label: "Median Days Early",
      value: kpis.medianDaysEarly !== null ? medianDays : "—",
    },
    {
      label: "Total Capital",
      value: formatCompactMoney(kpis.totalCapital),
    },
  ];

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-gradient rounded-2xl p-8 sm:p-10 mb-6 relative overflow-hidden"
    >
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
            @ArfurRock Intel
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1">
          Fundraise Intel Dashboard
        </h1>
        <p className="text-white/70 text-sm mb-8 max-w-xl">
          Tracking when rounds are called vs. officially announced — confirmed,
          rumored, and market datapoints.
        </p>

        {/* Big animated number */}
        <div className="mb-6">
          <span className="text-6xl sm:text-7xl font-black text-white tabular-nums">
            {totalEvents}
          </span>
          <span className="text-lg text-white/70 ml-3">events tracked</span>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm"
            >
              <span className="text-sm font-bold text-white tabular-nums">
                {pill.value}
              </span>
              <span className="text-xs text-white/70">{pill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
