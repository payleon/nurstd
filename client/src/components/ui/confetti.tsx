import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  duration?: number;
  pieces?: number;
  colors?: string[];
}

type ConfettiPiece = {
  x: number;
  y: number;
  rotation: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  speed: number;
  spinSpeed: number;
};

export function Confetti({ 
  duration = 5000, 
  pieces = 200, 
  colors = ['#4B9CD3', '#13294B', '#F8D858', '#5CDD8C', '#f06292'] 
}: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Create confetti pieces
    const newConfetti: ConfettiPiece[] = [];
    const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < pieces; i++) {
      newConfetti.push({
        x: Math.random() * 100, // percentage across screen
        y: -10 - Math.random() * 10, // start above viewport
        rotation: Math.random() * 360,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        speed: 1 + Math.random() * 3,
        spinSpeed: (Math.random() - 0.5) * 3
      });
    }
    
    setConfetti(newConfetti);
    
    // Set a timeout to remove the confetti after the duration
    const timer = setTimeout(() => {
      setActive(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, pieces, colors]);

  useEffect(() => {
    if (!active) return;
    
    // Animation frame logic
    let lastTime = 0;
    let animationFrameId: number;
    
    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      
      setConfetti(prevConfetti => 
        prevConfetti.map(piece => ({
          ...piece,
          y: piece.y + (piece.speed * delta * 0.02),
          rotation: (piece.rotation + piece.spinSpeed) % 360,
          // Add a slight horizontal drift
          x: piece.x + (Math.sin(time * 0.001 + piece.x) * 0.1)
        })).filter(piece => piece.y < 120) // Keep only pieces still in or near viewport
      );
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  // Early return if not active or no confetti pieces
  if (!active || confetti.length === 0) return null;
  
  // Render the confetti pieces
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece, i) => {
        let shapeElement;
        
        switch (piece.shape) {
          case 'circle':
            shapeElement = (
              <div className="rounded-full" 
                style={{ 
                  width: `${piece.size}px`, 
                  height: `${piece.size}px`, 
                  backgroundColor: piece.color 
                }} 
              />
            );
            break;
          case 'square':
            shapeElement = (
              <div 
                style={{ 
                  width: `${piece.size}px`, 
                  height: `${piece.size}px`, 
                  backgroundColor: piece.color 
                }} 
              />
            );
            break;
          case 'triangle':
            // Triangle using a CSS hack
            shapeElement = (
              <div 
                style={{ 
                  width: 0,
                  height: 0,
                  borderLeft: `${piece.size/2}px solid transparent`,
                  borderRight: `${piece.size/2}px solid transparent`,
                  borderBottom: `${piece.size}px solid ${piece.color}` 
                }} 
              />
            );
            break;
        }
        
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${piece.x}vw`,
              top: `${piece.y}vh`,
              transform: `rotate(${piece.rotation}deg)`,
            }}
          >
            {shapeElement}
          </div>
        );
      })}
    </div>
  );
}