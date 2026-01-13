"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FullPageLoaderProps {
  message?: string;
  show?: boolean;
}

export function FullPageLoader({
  message = "Loading...",
  show = true,
}: FullPageLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow fade-out animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0"
      )}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Chowvest Logo with Pulse Animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-12 w-12 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </div>
        </div>

        {/* Loading Message */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
