'use client';

import { 
  SpeakerLayout, 
  CallControls,
  useCall,
} from '@stream-io/video-react-sdk';

export const CallActive = () => {
  const call = useCall();

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden">
      <SpeakerLayout />
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        <CallControls onLeave={() => call?.leave()} />
      </div>
      
      {/* Active Session Indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full backdrop-blur-md">
        <div className="size-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Relay</span>
      </div>
    </div>
  );
};
