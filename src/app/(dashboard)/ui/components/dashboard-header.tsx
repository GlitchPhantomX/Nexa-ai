"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon, CommandIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-gray-200 bg-gray-50 flex items-center justify-between px-4 md:px-6 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="bg-white hover:bg-green-50 hover:text-green-700 transition-colors rounded-lg h-9 w-9 flex items-center justify-center border border-gray-200 shadow-sm" />
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50/50 rounded-full border border-green-100 text-green-700 text-xs font-semibold">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
            <SearchIcon className="size-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
          </div>
          <input
            type="text"
            className={cn(
              "block w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all duration-200",
              "focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500/50 focus:outline-none focus:shadow-sm",
              "placeholder:text-gray-400"
            )}
            placeholder="Search everything..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 pointer-events-none">
            <Kbd className="bg-white border-gray-200 text-[10px] h-5 px-1.5 flex items-center gap-0.5 shadow-sm">
              <CommandIcon className="size-2.5" />
              <span>K</span>
            </Kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 transition-all active:scale-95">
          <span>Feedback</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
