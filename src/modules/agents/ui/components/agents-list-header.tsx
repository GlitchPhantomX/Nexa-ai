"use client";

import React from "react";
import { PlusIcon, BotIcon, SparklesIcon, BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentsListHeaderProps {
  onOpenDialog: () => void;
}

const AgentsListHeader = ({ onOpenDialog }: AgentsListHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative size-14 rounded-2xl bg-white flex items-center justify-center border border-green-100 shadow-sm transition-transform group-hover:scale-105">
            <BotIcon className="size-7 text-green-600" />
            <div className="absolute -top-1 -right-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Agents
            </h1>
            <div className="px-2 py-0.5 rounded-md bg-green-50 border border-green-100 flex items-center gap-1">
              <SparklesIcon className="size-3 text-green-600" />
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                Elite
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Manage and deploy your autonomous AI workforce across the Nexa
            network.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="rounded-xl h-11 px-5 font-bold border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-all flex items-center gap-2"
        >
          <BookOpenIcon className="size-4" />
          <span className="hidden sm:inline">Documentation</span>
        </Button>
        <Button
          onClick={onOpenDialog}
          className="rounded-xl h-11 px-6 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <PlusIcon className="size-5" />
          <span>Create Agent</span>
        </Button>
      </div>
    </div>
  );
};

export default AgentsListHeader;
