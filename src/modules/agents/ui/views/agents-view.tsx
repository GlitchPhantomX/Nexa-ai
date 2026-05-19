"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AgentsView = () => {
  const { data: session } = authClient.useSession();
  const utils = trpc.useUtils();

  const [name, setName] = useState("");
  const [instruction, setInstruction] = useState("");

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

  const createMutation = trpc.agents.create.useMutation({
    onSuccess: () => {
      setName("");
      setInstruction("");
      utils.agents.getMany.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    createMutation.mutate({
      name,
      instruction,
      userId: session.user.id,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1>Agents Management (Functional)</h1>

      <div>
        <h2>Add New Agent</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">Name</label>
            <input
              className="border p-2 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">Instruction</label>
            <textarea
              className="border p-2 rounded-lg min-h-[100px]"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Deploying..." : "Submit Agent"}
          </button>
        </form>

        {createMutation.isError && (
          <p style={{ color: "red" }} className="mt-2 text-sm font-medium">
            Error: {createMutation.error.message}
          </p>
        )}
      </div>

      <hr />

      <div>
        <h2>Agent List</h2>

        {agentsQuery.data && (
          <ul className="flex flex-col gap-4 mt-4">
            {agentsQuery.data.map((agent) => (
              <li
                key={agent.id}
                className="border p-4 rounded-xl bg-white shadow-sm"
              >
                <strong className="text-lg text-green-700">{agent.name}</strong>
                <p className="text-gray-600 italic mt-1">
                  "{agent.instruction}"
                </p>
                <div className="mt-2">
                  <small className="text-gray-400 font-mono text-[10px]">
                    ID: {agent.id}
                  </small>
                </div>
              </li>
            ))}
            {agentsQuery.data.length === 0 && (
              <p className="text-gray-500">No records found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgentsView;
