"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  color: string;
}

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  color,
}: QuickActionCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start p-5 rounded-2xl bg-white/50 backdrop-blur-xl border border-slate-100/50 shadow-sm hover:shadow-md hover:bg-white transition-all text-left w-full group"
    >
      <div className={cn("p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 duration-300", color)}>
        <Icon className="size-5" />
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs font-medium text-slate-500 leading-relaxed">{description}</p>
    </motion.button>
  );
};
