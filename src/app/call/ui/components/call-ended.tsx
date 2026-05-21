'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const CallEnded = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 text-center">
      <div className="w-full max-w-md bg-slate-800/50 rounded-3xl border border-slate-700 p-10 backdrop-blur-sm shadow-2xl">
        <div className="size-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <CheckCircle2 className="size-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Mission Completed</h2>
        <p className="text-slate-400 text-sm mb-8">
          You have successfully left the relay session. The AI operative is now processing the transcripts.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full h-12 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold transition-all">
            <Link href="/meetings">
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full h-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-bold transition-all">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
