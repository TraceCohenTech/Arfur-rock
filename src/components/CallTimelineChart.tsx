"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useInView } from "@/hooks/useInView";
import { MonthlyTimelinePoint } from "@/lib/types";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/utils/chartTheme";

interface Props {
  data: MonthlyTimelinePoint[];
}

export default function CallTimelineChart({ data }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static p-5"
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="confirmedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: CHART_COLORS.tick, fontSize: 12 }}
              axisLine={{ stroke: CHART_COLORS.axis }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: CHART_COLORS.tick, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(value) => [`${value}`]}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#amberGradient)"
            />
            <Area
              type="monotone"
              dataKey="confirmed"
              stroke="#d97706"
              strokeWidth={2}
              fill="url(#confirmedGradient)"
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-6 mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-amber-500 rounded" />
          Total Calls
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-amber-700 rounded border-dashed" style={{ borderBottom: '1px dashed #d97706' }} />
          Confirmed
        </span>
      </div>
    </motion.div>
  );
}
