"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useInView } from "@/hooks/useInView";
import { StageBreakdown } from "@/lib/types";
import { AMBER_PALETTE, TOOLTIP_STYLE } from "@/utils/chartTheme";

interface Props {
  data: StageBreakdown[];
}

export default function RoundStageDonut({ data }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-static p-5"
    >
      <div className="h-[300px] flex items-center">
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={AMBER_PALETTE[index % AMBER_PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value) => [`${value} events`, "Count"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-2">
          <div className="space-y-2">
            {data.slice(0, 8).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: AMBER_PALETTE[i % AMBER_PALETTE.length] }}
                />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="ml-auto text-slate-400 tabular-nums text-xs">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
