import React from 'react'
import AgnetsView from '@/modules/agents/ui/views/agents-view'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, trpc } from '@/trpc/server'

import { Suspense } from 'react'
const Page = async () => {
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <AgnetsView />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page