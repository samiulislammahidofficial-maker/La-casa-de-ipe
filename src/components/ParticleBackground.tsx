import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number, y: number, size: number, vx: number, vy: number, color: string, baseAlpha: number, phase: number }> = [];

    // Thematic heist colors: Embers (red), Sparks (gold), Ash (white/grey)
    const colors = ['#8b0000', '#d4af37', '#ffffff', '#ffb4a8', '#555555'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust density for mobile vs desktop
      const density = window.innerWidth < 768 ? 12000 : 18000;
      const numParticles = Math.floor((canvas.width * canvas.height) / density); 
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 1) * 0.5 - 0.1, // Drifting upwards like ash/embers
          color: colors[Math.floor(Math.random() * colors.length)],
          baseAlpha: Math.random() * 0.4 + 0.1,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges smoothly
        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        // Only loop bottom to top to simulate continuous upwards drift
        if (p.y < -p.size) {
          p.y = canvas.height + p.size;
          p.x = Math.random() * canvas.width;
        }

        // Slight twinkle phase effect
        p.phase += 0.02;
        const currentAlpha = p.baseAlpha * (0.8 + Math.sin(p.phase) * 0.2);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[35] pointer-events-none mix-blend-screen opacity-50"
      aria-hidden="true"
    />
  );
}
