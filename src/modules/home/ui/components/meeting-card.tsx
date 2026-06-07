"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  MoreVertical,
  Bot,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MeetingCardProps {
  title: string;
  agentName: string;
  time: string;
  date: string;
  participants: number;
  status: "scheduled" | "ongoing" | "completed";
  className?: string;
}

export const MeetingCard = ({
  title,
  agentName,
  time,
  date,
  participants,
  status,
  className,
}: MeetingCardProps) => {
  const statusColors = {
    scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ongoing: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={className}
    >
      <Card className="border-none bg-white/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 line-clamp-1">{title}</h4>
                <Badge variant="outline" className={statusColors[status]}>
                  {status === "ongoing" && <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <CalendarIcon className="size-3" />
                {date} at {time}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="size-8 -mr-2">
              <MoreVertical className="size-4 text-slate-400" />
            </Button>
          </div>

          <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Bot className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI Agent</p>
                <p className="text-xs font-black text-slate-900">{agentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Avatar key={i} className="size-7 border-2 border-white">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ))}
               </div>
               <span className="text-[10px] font-bold text-slate-500">+{participants - 3}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button className="flex-1 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 h-10">
              {status === "ongoing" ? "Join Now" : "Details"}
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200 size-10">
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
