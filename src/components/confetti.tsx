
"use client";

import React from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  onConfettiComplete?: () => void;
}

export const Confetti = ({ onConfettiComplete }: ConfettiProps) => {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    // We can't know the window size on the server, so we wait until the component is mounted.
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Don't render until we have dimensions, prevents a flash of confetti in the corner.
  if (dimensions.width === 0) {
    return null;
  }

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={500}
      tweenDuration={10000}
      onConfettiComplete={() => {
        if (onConfettiComplete) {
          onConfettiComplete();
        }
      }}
      style={{ pointerEvents: 'none', zIndex: 9999, position: 'fixed', top: 0, left: 0 }}
    />
  );
};
