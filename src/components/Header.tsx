"use client";

import { motion } from "framer-motion";
import { Eye, Lock, Shield } from "lucide-react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { KPIDataExtended } from "@/utils/calculations";

interface Props {
  kpis: KPIDataExtended;
}

export default function Header({ kpis }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl mb-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #f59e0b 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/8 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-orange-500/8 blur-3xl" />

      <div className="relative z-10 p-6">
        {/* Single row: avatar + identity + right info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative shrink-0"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-amber-500/30">
              <Image
                src="/arfurrock-avatar.jpg"
                alt="ArfurRock"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </motion.div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Fundraise Intel Dashboard
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                <Eye className="w-3 h-3" />
                Anon
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-amber-400/90 font-medium">@ArfurRock</span>
              <span className="mx-2 text-slate-600">·</span>
              Anon GP at your favorite multi-stage VC
            </p>
          </div>

          {/* Right badges */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-amber-500/50" />
              Identity unknown
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-amber-500/50" />
              Verified intel
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
