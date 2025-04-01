import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M15 12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
        <path d="M7 9v7" />
        <path d="M10 9v7" />
        <path d="M17 9v2" />
      </svg>
      <span className="ml-2 text-xl font-bold tracking-tight">
        <span className="text-primary">Game</span>
        <span>Store Admin</span>
      </span>
    </div>
  );
}