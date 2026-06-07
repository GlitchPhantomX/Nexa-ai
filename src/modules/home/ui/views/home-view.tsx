// src/modules/home/ui/views/home-view.tsx
"use client";

import { motion } from "framer-motion";
import {
  Video,
  Bot,
  Mic,
  Calendar as CalendarIcon,
  FileAudio,
  Zap,
  History,
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MetricCard } from "../components/metric-card";
import { AnalyticsChart } from "../components/analytics-chart";
import { HeroSection } from "../components/hero-section";
import { MeetingCard } from "../components/meeting-card";
import { ActivityTimeline } from "../components/activity-timeline";
import { InsightCard } from "../components/insight-card";
import { StatusMonitor } from "../components/status-monitor";
import { QuickActionCard } from "../components/quick-action-card";
import { useMemo } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

// ─── animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// ─── section wrapper ──────────────────────────────────────────────────────────

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={cn("w-full", className)}
    >
      {children}
    </motion.section>
  );
}

// ─── section header ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="space-y-0.5">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="w-full h-px bg-slate-100" />;
}

// ─── loading skeleton ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <Skeleton className="h-[220px] w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Skeleton className="xl:col-span-2 h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── main view ────────────────────────────────────────────────────────────────

export const HomeView = () => {
  const { hello, dashboard, health, data } = useDashboard();

  const isLoading = hello.isLoading || dashboard.isLoading;
  const isError = hello.isError || dashboard.isError;

  const metrics = data?.metrics;
  const upcomingMeetings = data?.upcomingMeetings ?? [];
  const recentActivities = data?.recentActivities ?? [];
  const chartData = data?.chartData ?? [];

  const insights = useMemo(() => {
    if (!metrics) return [];
    const list: { type: string; message: string }[] = [];
    if (metrics.meetings.trend > 0)
      list.push({
        type: "recommendation",
        message: `Meeting volume up ${metrics.meetings.trend}% this week.`,
      });
    if (metrics.meetings.total > 0)
      list.push({
        type: "opportunity",
        message: `${metrics.meetings.completed} meetings completed with AI agents.`,
      });
    if (metrics.recordings.total > 0)
      list.push({
        type: "tip",
        message: `${metrics.recordings.transcriptions} transcriptions ready for review.`,
      });
    if (metrics.agents.total > 0)
      list.push({
        type: "recommendation",
        message: `Most active agent: ${metrics.agents.mostUsed}.`,
      });
    return list.slice(0, 3);
  }, [metrics]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Failed to load dashboard data.
          </p>
          <p className="text-xs text-slate-400">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10 px-4 py-8 md:px-10 md:py-10 max-w-[1440px] mx-auto min-h-screen"
    >

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <Section>
        <HeroSection
          userName={hello.data?.user?.name || "Nexa User"}
          metrics={metrics}
          upcomingCount={upcomingMeetings.length}
        />
      </Section>

      {/* ── METRIC CARDS ──────────────────────────────────────────────────── */}
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Meetings",
              value: metrics?.meetings.total ?? 0,
              icon: Video,
              trend: {
                value: Math.abs(metrics?.meetings.trend ?? 0),
                isPositive: (metrics?.meetings.trend ?? 0) >= 0,
              },
              chartData: chartData.map((d) => d.count),
              chartColor: "#10b981",
            },
            {
              title: "Active AI Agents",
              value: metrics?.agents.total ?? 0,
              icon: Bot,
              description: `${metrics?.agents.mostUsed ?? "—"} is most active`,
              chartData: [5, 6, 5, 7, 8, 8, metrics?.agents.total ?? 0],
              chartColor: "#6366f1",
            },
            {
              title: "Voice Interactions",
              value: metrics?.voice.totalConversations ?? 0,
              icon: Mic,
              trend: { value: metrics?.voice.accuracy ?? 0, isPositive: true },
              description: `${metrics?.voice.responseTime ?? "—"}ms avg response`,
              chartData: [10, 20, 15, 25, 30, 28, metrics?.voice.totalConversations ?? 0],
              chartColor: "#10b981",
            },
            {
              title: "Recording Storage",
              value: `${metrics?.recordings.storageGB ?? 0} GB`,
              icon: FileAudio,
              description: `${metrics?.recordings.total ?? 0} recordings processed`,
              chartData: [1, 2, 3, 5, 8, 10, metrics?.recordings.storageGB ?? 0],
              chartColor: "#f59e0b",
            },
          ].map((card, i) => (
            <motion.div key={card.title} variants={fadeUp} custom={i}>
              <MetricCard {...card} />
            </motion.div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ── ANALYTICS — full width ────────────────────────────────────────── */}
      <Section>
        {/*
          One unified card:
          ┌─────────────────────────────────────────────────┐
          │ Intelligence Hub          [Activity][Performance]│  ← tabs inside the card header
          │ Real-time workspace analytics                    │
          ├─────────────────────────────────────────────────┤
          │                   chart                         │
          └─────────────────────────────────────────────────┘
        */}
        <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <Tabs defaultValue="activity" className="w-full">

            {/* Card header — title + subtitle stacked, tabs below on their own row */}
            <div className="flex flex-col gap-4 px-6 pt-5 pb-4 border-b border-slate-100">
              {/* Row 1: title */}
              <div>
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  Intelligence Hub
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time workspace analytics</p>
              </div>
              {/* Row 2: tabs */}
              <TabsList className="bg-slate-100/80 border-0 p-1 rounded-xl h-9 w-fit">
                <TabsTrigger
                  value="activity"
                  className="rounded-lg text-xs font-medium px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="rounded-lg text-xs font-medium px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500"
                >
                  Performance
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Chart area — hideHeader so AnalyticsChart doesn't render its own title card */}
            <div className="p-4">
              <TabsContent value="activity" className="mt-0 outline-none">
                <AnalyticsChart
                  title="Meeting Activity"
                  description="Volume of meetings over the last 7 days."
                  type="area"
                  series={[{ name: "Meetings", data: chartData.map((d) => d.count) }]}
                  categories={chartData.map((d) => d.date)}
                  colors={["#10b981"]}
                  hideHeader
                />
              </TabsContent>

              <TabsContent value="performance" className="mt-0 outline-none">
                <AnalyticsChart
                  title="Avg. Meeting Duration"
                  description="Tracking productivity and conversation length."
                  type="line"
                  series={[
                    {
                      name: "Duration (min)",
                      data: [30, 45, 32, 50, 42, 38, metrics?.meetings.avgDuration ?? 0],
                    },
                  ]}
                  categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                  colors={["#6366f1"]}
                  hideHeader
                />
              </TabsContent>
            </div>

          </Tabs>
        </div>
      </Section>

      <Divider />

      {/* ── MAIN CONTENT GRID ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* LEFT: Schedule */}
        <Section className="xl:col-span-8 space-y-8 min-w-0">

          {/* Upcoming Schedule */}
          <div>
            <SectionHeader
              title="Upcoming Schedule"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500 hover:text-emerald-600 font-medium gap-1.5 -mr-2"
                >
                  View calendar
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              }
            />

            {upcomingMeetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600">
                    No upcoming meetings
                  </p>
                  <p className="text-xs text-slate-400">
                    Schedule your first meeting to get started
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 rounded-lg text-xs border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                >
                  Schedule meeting
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    title={meeting.name}
                    agentName={meeting.agentName}
                    date={
                      meeting.startedAt
                        ? new Date(meeting.startedAt).toLocaleDateString()
                        : "TBD"
                    }
                    time={
                      meeting.startedAt
                        ? new Date(meeting.startedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "TBD"
                    }
                    participants={1}
                    status={meeting.status as any}
                  />
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* RIGHT: Sidebar */}
        <Section className="xl:col-span-4 space-y-8">

          {/* Quick Actions */}
          <div>
            <SectionHeader
              title="Quick launch"
              subtitle="Jump into common actions"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
              <QuickActionCard
                title="New Agent"
                description="Deploy custom AI"
                icon={Bot}
                color="bg-indigo-50 text-indigo-600"
              />
              <QuickActionCard
                title="Schedule"
                description="Set a meeting"
                icon={CalendarIcon}
                color="bg-emerald-50 text-emerald-600"
              />
              <QuickActionCard
                title="Instant Call"
                description="Start call now"
                icon={Zap}
                color="bg-amber-50 text-amber-600"
              />
            </div>
          </div>

          {/* AI Insights */}
          {insights.length > 0 && (
            <div>
              <SectionHeader
                title="AI Insights"
                subtitle="Powered by your workspace data"
              />
              <div className="flex flex-col gap-2.5">
                {insights.map((insight, i) => (
                  <InsightCard
                    key={i}
                    type={insight.type as any}
                    message={insight.message}
                  />
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          <StatusMonitor items={health?.services ?? []} />
        </Section>
      </div>

      <Divider />

      {/* ── RECENT ACTIVITY ───────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          title="Recent Activity"
          subtitle="Timeline of your workspace events"
          action={
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-lg border-slate-200 text-slate-600 hover:border-slate-300 gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              Full history
            </Button>
          }
        />

        {recentActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No recent activity detected.</p>
          </div>
        ) : (
          <ActivityTimeline
            activities={recentActivities.map((a) => ({
              id: a.id,
              type: a.type as any,
              title: a.title,
              user: { name: "You" },
              time: new Date(a.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              description: a.description || undefined,
            }))}
          />
        )}
      </Section>
    </motion.div>
  );
};