"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EventRow } from "@/lib/types";
import { useInView } from "@/hooks/useInView";
import { DAYS_EARLY_BUCKETS, DAYS_EARLY_COLORS, CHART_COLORS, TOOLTIP_STYLE } from "@/utils/chartTheme";
import { median } from "@/lib/utils";

interface Props {
  events: EventRow[];
}

export default function DaysEarlyChart({ events }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  const { chartData, medianDays } = useMemo(() => {
    const confirmed = events.filter(
      (e) =>
        e.scope === "called_vs_announced" &&
        e.official_announce_date !== null &&
        e.delta_days_call_to_announce !== null &&
        e.delta_days_call_to_announce >= 0
    );

    const deltas = confirmed.map((e) => e.delta_days_call_to_announce!);
    const med = median(deltas);

    const data = DAYS_EARLY_BUCKETS.map((bucket) => ({
      name: bucket.label,
      count: confirmed.filter(
        (e) =>
          e.delta_days_call_to_announce! >= bucket.min &&
          e.delta_days_call_to_announce! <= bucket.max
      ).length,
    }));

    return { chartData: data, medianDays: med };
  }, [events]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-static p-5"
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: CHART_COLORS.tick, fontSize: 12 }}
              axisLine={{ stroke: CHART_COLORS.axis }}
              tickLine={false}
              label={{
                value: "Days",
                position: "insideBottomRight",
                offset: -4,
                fill: CHART_COLORS.label,
                fontSize: 11,
              }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: CHART_COLORS.tick, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Events",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: CHART_COLORS.label,
                fontSize: 11,
              }}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(value) => [`${value} events`, "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={DAYS_EARLY_COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart insight callout */}
      {medianDays !== null && (
        <div className="chart-insight mt-4 py-2 px-3 rounded-r-lg">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-amber-700">
              {Math.round(medianDays)} day
            </span>{" "}
            median lead time on confirmed calls
          </p>
        </div>
      )}
    </motion.div>
  );
}
