"use client";

import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

export const HomeView = () => {
  const helloQuery = trpc.hello.useQuery({ text: "Nexa User" });
  const statsQuery = trpc.getStats.useQuery();

  const isLoading = helloQuery.isLoading || statsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-gray-900 tracking-tight flex items-center gap-2">
          {helloQuery.data?.greeting || "Welcome to Nexa AI"}
        </p>
      </div>
    </div>
  );
};
