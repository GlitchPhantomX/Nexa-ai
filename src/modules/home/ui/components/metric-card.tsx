"use client";

// Redesigned MetricCard – minimal SaaS style, no fake live badges, balanced emerald accent
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MetricCardProps {
  /** Title of the KPI, e.g. "Total Meetings" */
  title: string;
  /** Primary value to display – number or formatted string */
  value: string | number;
  /** Icon displayed on the top‑right */
  icon: LucideIcon;
  /** Optional brief description under the value */
  description?: string;
  /** Trend arrow with percent change */
  trend?: {
    value: number; // percent value
    isPositive: boolean;
  };
  /** Small sparkline data (optional) */
  chartData?: number[];
  /** Accent colour for the chart and icon background – defaults to brand emerald */
  chartColor?: string;
  /** Additional Tailwind classes */
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  chartData = [],
  chartColor = "#10b981",
  className,
}: MetricCardProps) => {
  // ApexCharts options – minimal, no toolbar, subtle grid
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: [chartColor],
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] },
    },
    tooltip: { enabled: false },
    grid: { padding: { top: 8, bottom: 0, left: 0, right: 0 } },
  };

  const chartSeries = [{ name: title, data: chartData }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="group h-full"
    >
      <Card
        className={cn(
          "flex flex-col h-full border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        {/* Header – title & icon */}
        <div className="flex items-center justify-between p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </h3>
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              // use the same colour as the chart accent but with opacity
              "bg-emerald-50 text-emerald-600",
              chartColor !== "#10b981" && "bg-gray-50"
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>

        {/* Body – value, trend, optional description */}
        <div className="flex-1 px-4 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-sm font-medium",
                  trend.isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-1" title={description}>
              {description}
            </p>
          )}
        </div>

        {/* Footer – optional sparkline */}
        {chartData.length > 0 && (
          <div className="px-4 pb-4">
            <Chart options={chartOptions} series={chartSeries} type="area" height={48} width="100%" />
          </div>
        )}
      </Card>
    </motion.div>
  );
};
