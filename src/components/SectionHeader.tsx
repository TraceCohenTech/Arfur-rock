"use client";

import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3 mb-3"
    >
      {icon && (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-400 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
