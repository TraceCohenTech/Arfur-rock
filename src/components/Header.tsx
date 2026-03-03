"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
          <Radio className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          @ArfurRock Intel
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
        Fundraise Intel Dashboard
      </h1>
      <p className="text-slate-500 mt-1 text-sm">
        Tracking when rounds are called vs. officially announced — confirmed,
        rumored, and market datapoints.
      </p>
    </motion.header>
  );
}
