"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardUserButton from "./Dashboard-user-button";

const openShortcuts = () => {
  window.dispatchEvent(new CustomEvent("open-shortcuts"));
};

export const DashboardNavbar = () => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "h-16 w-full",
        "bg-white border-b border-gray-200 shadow-sm",
        "flex items-center justify-between px-4 md:px-6 shrink-0",
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="bg-gray-50 hover:bg-green-50 hover:text-green-700 transition-colors rounded-lg h-9 w-9 flex items-center justify-center border border-gray-200 shadow-sm" />

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100 text-green-700 text-xs font-semibold">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* Center — Search bar with ⌘K inside */}
      <div className="flex-1 max-w-md mx-6 hidden sm:block">
        <button
          type="button"
          onClick={openShortcuts}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-xl",
            "border border-gray-200 bg-gray-50 px-3.5 py-2",
            "text-left text-sm shadow-sm transition-all duration-200",
            "hover:border-green-400 hover:bg-white hover:shadow-md hover:shadow-green-100",
            "focus:outline-none",
          )}
        >
          <SearchIcon className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-green-600 transition-colors" />
          <span className="flex-1 text-sm text-gray-400 group-hover:text-gray-500 transition-colors select-none">
            Search everything...
          </span>
          <kbd className="inline-flex items-center rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 shadow-sm group-hover:border-green-200 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Mobile: icon-only search */}
        <button
          onClick={openShortcuts}
          className="flex sm:hidden items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all shadow-sm"
          aria-label="Open search"
        >
          <SearchIcon className="h-4 w-4" />
        </button>

        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 transition-all active:scale-95">
          <span>Feedback</span>
        </button>

        {/* User button */}
        <DashboardUserButton variant="header" />
      </div>
    </header>
  );
};

export default DashboardNavbar;