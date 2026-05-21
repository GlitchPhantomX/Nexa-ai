'use client';

import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CallConnectProps {
  meetingId: string;
  meetingName?: string;
  userId: string;
  userName?: string;
  userImage?: string;
  callingState?: string;
}

const CallConnectUI = ({ 
  meetingId, 
  meetingName, 
  userId, 
  userName, 
  userImage,
  callingState 
}: CallConnectProps) => {
  const showStates = ['joining', 'reconnecting', 'migrating', 'initializing'];
  const shouldShow = callingState && showStates.includes(callingState.toLowerCase());

  if (shouldShow) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={userImage} />
              <AvatarFallback className="bg-slate-800 text-2xl font-bold">
                {userName?.charAt(0).toUpperCase() || userId.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary animate-pulse shadow-lg">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight">{userName || 'User'}</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Establishing secure connection...</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-xs text-center">
          <div className="h-px w-16 bg-slate-800" />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Meeting Room</p>
            <p className="text-lg font-semibold text-slate-200 truncate px-4">
              {meetingName || 'Meeting Session'}
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase">
              ID: {meetingId}
            </p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
        </div>
      </div>
    );
  }

  return null;
};

const CallConnectWithHooks = (props: CallConnectProps) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  
  return <CallConnectUI {...props} callingState={callingState} />;
};

export const CallConnect = (props: CallConnectProps) => {
  // If callingState is provided as a prop, we use it directly (no hooks needed)
  if (props.callingState) {
    return <CallConnectUI {...props} />;
  }

  // Otherwise, we render a component that uses Stream hooks (must be inside StreamCall context)
  return <CallConnectWithHooks {...props} />;
};
