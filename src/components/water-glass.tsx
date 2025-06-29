
"use client"
import React, { useState, useEffect } from "react"

type BubbleStyle = {
  left: string;
  animationDelay: string;
  animationDuration: string;
  transform: string;
};

export const WaterGlass = ({ percentage }: { percentage: number }) => {
  const waterHeight = Math.min(100, Math.max(0, percentage))
  const [bubbleStyles, setBubbleStyles] = useState<BubbleStyle[]>([])
  
  useEffect(() => {
    // Generate bubble styles only on the client to avoid hydration mismatch
    const styles = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      transform: `scale(${0.5 + Math.random()})`
    }));
    setBubbleStyles(styles);
  }, []);

  return (
    <div 
      className="relative h-64 w-40 mx-auto border-4 border-slate-400/50 dark:border-slate-500/50 rounded-t-xl rounded-b-3xl bg-slate-500/10 backdrop-blur-sm overflow-hidden shadow-inner select-none"
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-primary/80 transition-all duration-1000 ease-in-out"
        style={{ 
          height: `${waterHeight}%`,
        }}
      >
        {/* Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {bubbleStyles.map((style, i) => (
            <div 
              key={i}
              className="absolute bottom-0 w-1 h-1 bg-white/50 rounded-full animate-rise"
              style={style}
            ></div>
          ))}
        </div>
      </div>
       <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center pointer-events-none">
        <span className="font-headline text-5xl font-black text-white" style={{textShadow: '2px 2px 4px hsl(var(--background))'}}>{Math.round(waterHeight)}%</span>
        <p className="font-code text-sm text-white/80 font-bold">Hydrated</p>
      </div>
    </div>
  )
}
