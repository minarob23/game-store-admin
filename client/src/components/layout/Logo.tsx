import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          {/* Base controller */}
          <rect x="1.5" y="6" width="21" height="12" rx="4" ry="4" />
          
          {/* D-pad */}
          <path d="M4 12h3M5.5 10.5v3" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Buttons */}
          <circle cx="17" cy="10" r="1.2" fill="currentColor" /> {/* A */}
          <circle cx="19" cy="12" r="1.2" fill="currentColor" /> {/* B */}
          <circle cx="15" cy="12" r="1.2" fill="currentColor" /> {/* X */}
          <circle cx="17" cy="14" r="1.2" fill="currentColor" /> {/* Y */}
          
          {/* Top bumpers */}
          <path d="M8.5 6.5v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
          
          {/* Accent light */}
          <path d="M12 6v1" className="animate-pulse opacity-75" />
        </svg>
        
        {/* Small purple pulse glow effect */}
        <div className="absolute inset-0 bg-primary rounded-full opacity-10 blur-xl animate-pulse" style={{ width: "38px", height: "38px" }}></div>
      </div>
      
      <div className="ml-3 flex flex-col">
        <div className="text-xl font-bold tracking-tight flex items-center">
          <span className="text-primary mr-1">Game</span>
          <span>Store</span>
        </div>
        <div className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Admin Panel</div>
      </div>
    </div>
  );
}