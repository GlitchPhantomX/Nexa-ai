import React, { Suspense } from 'react'
import { MeetingIdView } from '@/modules/meetings/ui/views/meeting-id-view'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, trpc } from '@/trpc/server'

interface PageProps {
  params: Promise<{ meetingId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const queryClient = getQueryClient();
  const { meetingId } = await params;

  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className="text-sm text-gray-500 animate-pulse font-medium tracking-tight">Accessing encrypted session data...</p>}>
        <MeetingIdView meetingId={meetingId} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page