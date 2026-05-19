"use client";

import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  /**
   * The primary error title.
   * @default "Something went wrong"
   */
  title?: string;
  /**
   * Detailed explanation of the error.
   */
  description?: string;
  /**
   * Optional function to trigger a retry of the failed action.
   */
  onRetry?: () => void;
  /**
   * Optional className for the container.
   */
  className?: string;
}

/**
 * A professional, centered error state component with optional retry logic.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while processing your request.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[50vh] w-full p-8 text-center animate-in zoom-in-95 duration-500",
        className
      )}
    >
      <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-6 border border-red-100 shadow-sm">
        <AlertCircleIcon className="size-8 text-red-600" />
      </div>
      
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-bold text-red-950 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-red-700/70 font-medium max-w-[320px] mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="rounded-xl border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 transition-all font-bold gap-2 active:scale-95"
        >
          <RefreshCcwIcon className="size-4" />
          <span>Retry Connection</span>
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
