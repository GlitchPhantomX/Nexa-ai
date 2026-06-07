// Redesigned HeroSection – personalized, data‑driven, minimal SaaS feel
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  /** Full name of the signed‑in user */
  userName: string;
  /** Dashboard metrics needed for quick insights */
  metrics?: {
    meetings?: { total?: number; ongoing?: number };
    agents?: { total?: number };
    recordings?: { total?: number };
    voice?: { totalConversations?: number };
  };
  /** Optional count of upcoming meetings for the day */
  upcomingCount?: number;
}

/** Simple greeting that adapts to time of day */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const HeroSection = ({ userName, metrics, upcomingCount }: HeroSectionProps) => {
  const greeting = getGreeting();
  const firstName = userName?.split(" ")?.[0] ?? "User";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8">
      {/* Header – greeting */}
      <h1 className="text-3xl font-bold text-slate-900">
        {greeting}, <span className="text-emerald-600">{firstName}</span>.
      </h1>
      {/* Sub‑text with quick stats */}
      <p className="mt-2 text-sm text-slate-500">
        {upcomingCount !== undefined ? (
          <>You have {upcomingCount} meeting{upcomingCount !== 1 && "s"} scheduled today.</>
        ) : (
          "Your dashboard is up to date."
        )}
      </p>

      {/* Quick stats grid – four key numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-slate-500">Meetings</span>
          <span className="text-2xl font-semibold text-slate-900">
            {metrics?.meetings?.total ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-slate-500">Active agents</span>
          <span className="text-2xl font-semibold text-slate-900">
            {metrics?.agents?.total ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-slate-500">Transcriptions</span>
          <span className="text-2xl font-semibold text-slate-900">
            {metrics?.recordings?.total ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-slate-500">Voice calls</span>
          <span className="text-2xl font-semibold text-slate-900">
            {metrics?.voice?.totalConversations ?? 0}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          New meeting
        </Button>
        <Button variant="outline" className="border-slate-300 text-slate-700">
          Manage agents
        </Button>
        <Button variant="ghost" className="text-slate-500">
          <Zap className="size-4 mr-1" /> Quick actions
        </Button>
      </div>
    </section>
  );
};
