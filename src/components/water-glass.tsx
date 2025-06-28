"use client"
import React, { useState, useEffect, useRef } from "react"

type BubbleStyle = {
  left: string;
  animationDelay: string;
  animationDuration: string;
  transform: string;
};

export const WaterGlass = ({ percentage }: { percentage: number }) => {
  const waterHeight = Math.min(100, Math.max(0, percentage))
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [bubbleStyles, setBubbleStyles] = useState<BubbleStyle[]>([])
  const glassRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event
      // beta is front-to-back tilt (-180 to 180)
      // gamma is left-to-right tilt (-90 to 90)
      
      // Cap the tilt to a reasonable range to avoid extreme rotation
      const cappedBeta = Math.max(-45, Math.min(45, beta || 0))
      const cappedGamma = Math.max(-45, Math.min(45, gamma || 0))

      setTilt({ x: cappedBeta, y: cappedGamma })
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

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
      ref={glassRef}
      className="relative h-64 w-40 mx-auto border-4 border-slate-400/50 dark:border-slate-500/50 rounded-t-xl rounded-b-3xl bg-slate-500/10 backdrop-blur-sm overflow-hidden shadow-inner select-none"
      style={{ perspective: '1000px' }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-primary/80 transition-all duration-1000 ease-in-out"
        style={{ 
          height: `${waterHeight}%`,
          transform: `rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div className="absolute top-0 left-1/2 w-[200%] h-5 bg-background/30 rounded-[45%] animate-wave -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-[200%] h-5 bg-background/20 rounded-[40%] animate-wave-reverse -translate-x-1/2 -translate-y-1/2 opacity-80"></div>

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
        <span className="font-headline text-5xl font-black text-white" style={{WebkitTextStroke: '1px hsl(var(--primary))', textShadow: '2px 2px 4px hsl(var(--background))'}}>{Math.round(waterHeight)}%</span>
        <p className="font-code text-sm text-white/80 font-bold">Hydrated</p>
      </div>
    </div>
  )
}
