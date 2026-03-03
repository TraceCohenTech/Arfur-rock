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
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-1"
    >
      {icon && (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600 shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
