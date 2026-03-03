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

interface Props {
  events: EventRow[];
}

const BUCKETS = [
  { label: "0–7", min: 0, max: 7 },
  { label: "8–30", min: 8, max: 30 },
  { label: "31–90", min: 31, max: 90 },
  { label: "91–180", min: 91, max: 180 },
  { label: "181+", min: 181, max: Infinity },
];

const COLORS = ["#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"];

export default function DaysEarlyChart({ events }: Props) {
  const chartData = useMemo(() => {
    const confirmed = events.filter(
      (e) =>
        e.scope === "called_vs_announced" &&
        e.official_announce_date !== null &&
        e.delta_days_call_to_announce !== null &&
        e.delta_days_call_to_announce >= 0
    );

    return BUCKETS.map((bucket) => ({
      name: bucket.label,
      count: confirmed.filter(
        (e) =>
          e.delta_days_call_to_announce! >= bucket.min &&
          e.delta_days_call_to_announce! <= bucket.max
      ).length,
    }));
  }, [events]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-static p-5 mb-8"
    >
      <h3 className="text-sm font-semibold text-slate-900 mb-1">
        Days Early Distribution
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Confirmed called vs. announced events only
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              label={{
                value: "Days",
                position: "insideBottomRight",
                offset: -4,
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Events",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                padding: "8px 12px",
              }}
              labelStyle={{ fontWeight: 600, color: "#0f172a" }}
              formatter={(value) => [`${value} events`, "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
