"use client";

import { trpc } from "@/trpc/client";
import { 
  VideoIcon, 
  BotIcon, 
  ActivityIcon, 
  ClockIcon,
  SparklesIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const HomeView = () => {
  const helloQuery = trpc.hello.useQuery({ text: "Nexa User" });
  const statsQuery = trpc.getStats.useQuery();

  const isLoading = helloQuery.isLoading || statsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <div className="size-10 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/20">
            <SparklesIcon className="size-6 text-white" />
          </div>
          {helloQuery.data?.greeting || "Welcome to Nexa AI"}
        </h1>
        <p className="text-gray-500 font-medium pl-1">
          Your intelligent workspace is optimized and ready for today's tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-gray-600">Total Meetings</CardTitle>
            <div className="size-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <VideoIcon className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-900">{stats?.totalMeetings}</div>
            <p className="text-xs text-green-600 font-bold mt-1">
              <span className="inline-block rotate-45 mr-1">↑</span>
              12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-gray-600">Active AI Agents</CardTitle>
            <div className="size-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <BotIcon className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-900">{stats?.aiAgentsActive}</div>
            <p className="text-xs text-green-600 font-bold mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-gray-600">Resource Usage</CardTitle>
            <div className="size-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <ActivityIcon className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-900">{stats?.usageLimit}%</div>
            <div className="w-full bg-gray-100 h-2 mt-3 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${stats?.usageLimit}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/50 p-4 px-6">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <ClockIcon className="size-5 text-gray-500" />
            Recent Workspace Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {stats?.recentActivity.map((activity: any) => (
              <div key={activity.id || activity.title} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50/80 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-11 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
                    activity.type === "Meeting" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {activity.type === "Meeting" ? <VideoIcon className="size-5" /> : <BotIcon className="size-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 group-hover:text-green-900 transition-colors">{activity.title}</span>
                    <span className="text-xs text-gray-500 font-medium">{activity.type}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
