"use client"
import React from "react"

export const WaterGlass = ({ percentage }: { percentage: number }) => {
  const waterHeight = Math.min(100, Math.max(0, percentage))

  return (
    <div className="relative h-64 w-40 mx-auto border-4 border-slate-400/50 dark:border-slate-500/50 rounded-t-xl rounded-b-3xl bg-slate-500/10 backdrop-blur-sm overflow-hidden shadow-inner select-none">
      <div
        className="absolute bottom-0 left-0 right-0 bg-primary/80 transition-all duration-1000 ease-in-out"
        style={{ height: `${waterHeight}%` }}
      >
        <div className="absolute top-0 left-1/2 w-[200%] h-5 bg-background/30 rounded-[45%] animate-wave -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-[200%] h-5 bg-background/20 rounded-[40%] animate-wave-reverse -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      </div>
       <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center pointer-events-none">
        <span className="font-headline text-5xl font-black text-white" style={{WebkitTextStroke: '1px hsl(var(--primary))', textShadow: '2px 2px 4px hsl(var(--background))'}}>{Math.round(waterHeight)}%</span>
        <p className="font-code text-sm text-white/80 font-bold">Hydrated</p>
      </div>
    </div>
  )
}
