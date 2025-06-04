import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const RainbowCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPoints = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleMouseMove = (e: MouseEvent) => {
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Keep only points from the last 1 second
      const cutoff = Date.now() - 1000;
      trailPoints.current = trailPoints.current.filter(point => point.timestamp > cutoff);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trailPoints.current.length > 1) {
        const now = Date.now();
        
        for (let i = 1; i < trailPoints.current.length; i++) {
          const point = trailPoints.current[i];
          const prevPoint = trailPoints.current[i - 1];
          
          // Calculate age of the point (0 to 1, where 0 is newest)
          const age = (now - point.timestamp) / 1000;
          const opacity = Math.max(0, 1 - age);
          
          if (opacity > 0) {
            // Create rainbow gradient based on position in trail
            const hue = (i / trailPoints.current.length) * 360;
            const lineWidth = Math.max(1, 8 * opacity);
            
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default RainbowCursorTrail;
