'use client';

import { 
  SpeakerLayout, 
  CallControls,
  useCall,
} from '@stream-io/video-react-sdk';
import { VoiceAssistant } from './voice-assistant';
import { useParams } from 'next/navigation';

export const CallActive = () => {
  const call = useCall();
  const params = useParams();
  const meetingId = params.meetingId as string;

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden text-slate-900">
      <div className="h-full w-full [&_.str-video__speaker-layout]:!bg-white [&_.str-video__speaker-layout]:!text-slate-900">
        <SpeakerLayout />
      </div>
      
      {/* AI Voice Assistant */}
      <VoiceAssistant meetingId={meetingId} />

      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        <div className="p-2 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl">
          <CallControls onLeave={() => call?.leave()} />
        </div>
      </div>
      
      {/* Active Session Indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full backdrop-blur-md shadow-sm">
        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Live Relay</span>
      </div>
    </div>
  );
};
