"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InsightCardProps {
  type: "recommendation" | "warning" | "opportunity" | "tip";
  message: string;
  className?: string;
}

const config = {
  recommendation: { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  opportunity: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  tip: { icon: Lightbulb, color: "text-purple-500", bg: "bg-purple-50" },
};

export const InsightCard = ({ type, message, className }: InsightCardProps) => {
  const { icon: Icon, color, bg } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={className}
    >
      <Card className="border-none bg-white/40 backdrop-blur-md shadow-none hover:bg-white/60 transition-colors">
        <CardContent className="p-4 flex gap-4">
          <div className={cn("shrink-0 size-10 rounded-xl flex items-center justify-center", bg)}>
            <Icon className={cn("size-5", color)} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               {type}
            </p>
            <p className="text-sm font-bold text-slate-700 leading-snug">
               {message}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
