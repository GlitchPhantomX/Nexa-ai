"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, Globe, Zap, Database, Server } from "lucide-react";

interface StatusItem {
  name: string;
  status: "online" | "degraded" | "offline";
  latency?: string;
}

const statusMap = {
  online: { color: "bg-emerald-500", text: "text-emerald-500", label: "Operational" },
  degraded: { color: "bg-amber-500", text: "text-amber-500", label: "Degraded" },
  offline: { color: "bg-rose-500", text: "text-rose-500", label: "Outage" },
};

export const StatusMonitor = ({ items }: { items: StatusItem[] }) => {
  return (
    <Card className="border-none bg-white/50 backdrop-blur-xl shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Activity className="size-4 text-emerald-500" />
            System Status
          </CardTitle>
          <div className="flex items-center gap-1.5">
             <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">All Systems Go</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-white">
                 {item.name.toLowerCase().includes("api") ? <Zap className="size-4 text-slate-400" /> : 
                  item.name.toLowerCase().includes("database") ? <Database className="size-4 text-slate-400" /> :
                  <Server className="size-4 text-slate-400" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-[10px] font-medium text-slate-400">{item.latency || "45ms"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <span className={cn("text-[10px] font-black uppercase tracking-tighter", statusMap[item.status].text)}>
                  {statusMap[item.status].label}
               </span>
               <div className={cn("size-1.5 rounded-full", statusMap[item.status].color)} />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
