'use client';

import { 
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import { Loader2 } from 'lucide-react';
import { CallLobby } from './call-lobby';
import { CallActive } from './call-active';
import { CallEnded } from './call-ended';

export const CallUI = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // 1. Lobby Theme
  if (callingState === CallingState.IDLE) {
    return <CallLobby />;
  }

  // 2. Call Theme
  if (callingState === CallingState.JOINED) {
    return <CallActive />;
  }

  // 3. Ended Theme
  if (callingState === CallingState.LEFT) {
    return <CallEnded />;
  }

  // Loading State for joining/leaving
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Processing Relay Status...</p>
      </div>
    </div>
  );
};
