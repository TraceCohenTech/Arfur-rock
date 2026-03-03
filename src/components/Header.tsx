"use client";

import { motion } from "framer-motion";
import { Eye, Lock, Shield } from "lucide-react";
import Image from "next/image";
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
      className="relative rounded-2xl mb-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,158,11,0.15) 2px, rgba(245,158,11,0.15) 4px)",
        }}
      />

      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #f59e0b 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Amber glow spots */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 p-8 sm:p-10">
        {/* Top row: avatar + identity */}
        <div className="flex items-start gap-5 mb-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative shrink-0"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20">
              <Image
                src="/arfurrock-avatar.jpg"
                alt="ArfurRock"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </motion.div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                @ArfurRock
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                <Eye className="w-3 h-3" />
                Anon
              </span>
            </div>
            <p className="text-amber-400/90 text-sm font-medium mb-1">
              Anon GP at your favorite multi-stage VC
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              OS intel for the private markets. Tracking when rounds are called
              vs. officially announced — before the news breaks.
            </p>

            {/* Mini badges */}
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Lock className="w-3 h-3 text-amber-500/60" />
                Identity unknown
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Shield className="w-3 h-3 text-amber-500/60" />
                Verified intel
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6" />

        {/* Title + big number */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Fundraise Intel Dashboard
            </h1>
          </div>
          <div className="text-right">
            <span className="text-5xl sm:text-6xl font-black text-amber-400 tabular-nums">
              {totalEvents}
            </span>
            <span className="text-sm text-slate-400 ml-2">events tracked</span>
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <span className="text-sm font-bold text-amber-400 tabular-nums">
                {pill.value}
              </span>
              <span className="text-xs text-slate-400">{pill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
