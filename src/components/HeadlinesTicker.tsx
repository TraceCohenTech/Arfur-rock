"use client";

import { motion } from "framer-motion";
import { Headline } from "@/lib/types";

interface Props {
  headlines: Headline[];
}

const typeColors: Record<Headline["type"], string> = {
  confirmed: "text-amber-600",
  rumor: "text-violet-600",
  datapoint: "text-slate-500",
};

const typeDots: Record<Headline["type"], string> = {
  confirmed: "bg-amber-500",
  rumor: "bg-violet-500",
  datapoint: "bg-slate-400",
};

export default function HeadlinesTicker({ headlines }: Props) {
  if (headlines.length === 0) return null;

  // Double the list for seamless loop
  const doubled = [...headlines, ...headlines];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden glass-static mb-6"
    >
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="ticker-track flex items-center gap-8 py-2 px-4 whitespace-nowrap">
        {doubled.map((h, i) => (
          <span key={i} className="flex items-center gap-2 text-sm">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeDots[h.type]}`} />
            <span className={typeColors[h.type]}>{h.text}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
