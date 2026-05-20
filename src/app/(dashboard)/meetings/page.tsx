import React, { Suspense } from 'react'
import { MeetingsView } from '@/modules/meetings/ui/views/meetings-view'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants'

interface PageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const queryClient = getQueryClient();
  const params = await searchParams;

  const page = Number(params.page ?? DEFAULT_PAGE);
  const pageSize = Number(params.pageSize ?? DEFAULT_PAGE_SIZE);

  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      page,
      pageSize,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className="text-sm text-gray-500 animate-pulse font-medium tracking-tight">Accessing mission logs...</p>}>
        <MeetingsView />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page