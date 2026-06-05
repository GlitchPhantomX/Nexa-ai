'use client';

import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { trpc } from "@/trpc/client";
import { Mic, MicOff, Loader2, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const VoiceAssistant = ({ meetingId }: { meetingId: string }) => {
  const { data: meeting } = trpc.meetings.getOne.useQuery({ id: meetingId });
  const { 
    isListening, 
    isProcessing, 
    messages, 
    startListening 
  } = useVoiceAssistant({ agentId: meeting?.agentId });

  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages, isListening]);

  return (
    <div className={cn(
        "fixed right-6 top-24 bottom-24 w-80 flex flex-col gap-4 z-50 transition-all duration-300 ease-in-out",
        !isOpen && "translate-x-[calc(100%+24px)]"
    )}>
      {/* Toggle Button */}
      <Button 
        variant="secondary" 
        size="icon" 
        className={cn(
            "absolute -left-12 top-0 rounded-full shadow-lg border border-slate-200 bg-white text-emerald-600 hover:bg-slate-50 transition-opacity",
            isOpen && "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="size-4" />
      </Button>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
            <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Nexa AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
                {isProcessing && <Loader2 className="size-3 animate-spin text-emerald-600" />}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-6 text-slate-400 hover:text-slate-600"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="size-3" />
                </Button>
            </div>
        </div>

        <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-white">
            <div className="flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                            <MessageSquare className="size-6 text-emerald-500" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium max-w-[160px]">
                            Click the button below and start talking to your AI agent.
                        </p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                        m.role === 'user' 
                            ? "bg-emerald-600 text-white self-end rounded-tr-none shadow-md shadow-emerald-200" 
                            : "bg-slate-100 text-slate-700 self-start rounded-tl-none border border-slate-200/50"
                    )}>
                        {m.content}
                    </div>
                ))}
                {isListening && (
                    <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-tighter animate-pulse">
                        <span className="size-1 rounded-full bg-emerald-500" />
                        Listening to you...
                    </div>
                )}
            </div>
        </ScrollArea>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
            <Button 
                onClick={startListening} 
                disabled={isListening || isProcessing}
                className={cn(
                    "w-full rounded-xl gap-3 h-12 text-sm font-bold transition-all shadow-lg",
                    isListening 
                        ? "bg-red-500 hover:bg-red-600 animate-pulse text-white shadow-red-200" 
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                )}
            >
                {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                {isListening ? "Listening..." : "Push to Talk"}
            </Button>
            <p className="mt-3 text-[9px] text-center text-slate-400 font-medium uppercase tracking-widest">
                Powered by Nexa AI Core
            </p>
        </div>
      </div>
    </div>
  );
};
