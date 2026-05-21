'use client';

import { 
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { Loader2, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const CallLobby = () => {
  const call = useCall();
  const { 
    useMicrophoneState, 
    useCameraState 
  } = useCallStateHooks();
  
  const { isMuted: isMicMuted, microphone } = useMicrophoneState();
  const { isMuted: isCamMuted, camera } = useCameraState();

  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await call?.join();
    } catch (error) {
      console.error('Error joining call:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-3xl bg-slate-800/50 rounded-3xl border border-slate-700 p-8 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Video Preview */}
          <div className="w-full md:w-1/2 aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative group">
            <VideoPreview />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant={isMicMuted ? "destructive" : "secondary"} 
                size="icon" 
                className="rounded-full"
                onClick={() => microphone.toggle()}
              >
                {isMicMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </Button>
              <Button 
                variant={isCamMuted ? "destructive" : "secondary"} 
                size="icon" 
                className="rounded-full"
                onClick={() => camera.toggle()}
              >
                {isCamMuted ? <VideoOff className="size-4" /> : <Video className="size-4" />}
              </Button>
            </div>
          </div>

          {/* Join Controls */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
              <p className="text-slate-400 text-sm">Check your camera and microphone before entering the mission room.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className={`size-2 rounded-full ${isMicMuted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                <span className="text-sm font-medium text-slate-300">
                  Microphone is {isMicMuted ? 'Off' : 'On'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className={`size-2 rounded-full ${isCamMuted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                <span className="text-sm font-medium text-slate-300">
                  Camera is {isCamMuted ? 'Off' : 'On'}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleJoin} 
              disabled={isJoining}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isJoining ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Join Mission Room"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
