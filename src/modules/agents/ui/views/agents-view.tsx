"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import AgentsListHeader from "../components/agents-list-header";
import { NewAgentDialog } from "../components/new-agent-dialog";

export const AgentsView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const agentsQuery = trpc.agents.getMany.useQuery();

  if (agentsQuery.isLoading) {
    return (
      <LoadingState
        title="Accessing Fleet Command"
        description="Synchronizing your autonomous agents with the Nexa AI network..."
      />
    );
  }

  if (agentsQuery.isError) {
    return (
      <ErrorState
        title="Communication Failure"
        description={agentsQuery.error.message}
        onRetry={() => agentsQuery.refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AgentsListHeader onOpenDialog={() => setIsDialogOpen(true)} />

      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Active Fleet</h2>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {agentsQuery.data?.length || 0} Operatives
          </span>
        </div>

        {agentsQuery.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentsQuery.data.map((agent) => (
              <div
                key={agent.id}
                className="group border border-gray-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-green-100 transition-all cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-mono text-gray-300">
                    {agent.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3 italic leading-relaxed">
                  "{agent.instruction}"
                </p>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                    Operational
                  </span>
                  <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {agentsQuery.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
            <p className="text-gray-400 font-medium">
              No active agents found in your fleet.
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-4 text-green-600 font-bold hover:text-green-700 underline underline-offset-4"
            >
              Deploy your first agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsView;
