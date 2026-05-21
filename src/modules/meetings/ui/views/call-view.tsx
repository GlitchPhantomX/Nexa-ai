'use client';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { StreamCallProvider } from '@/app/call/ui/components/call-provider';
import { CallUI } from '@/app/call/ui/components/call-ui';

interface CallViewProps {
  meetingId: string;
}

export const CallView = ({ meetingId }: CallViewProps) => {
  return (
    <StreamCallProvider meetingId={meetingId}>
      <CallUI />
    </StreamCallProvider>
  );
};
