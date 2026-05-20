import React, { Suspense } from 'react'
import { AgentIdView } from '@/modules/agents/ui/views/agent-id-view'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, trpc } from '@/trpc/server'

interface PageProps {
  params: Promise<{ agentId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const queryClient = getQueryClient();
  const { agentId } = await params;

  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({
      id: agentId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className="text-sm text-gray-500 animate-pulse">Establishing secure uplink...</p>}>
        <AgentIdView agentId={agentId} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page