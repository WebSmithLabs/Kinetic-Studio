import React, { useEffect, useRef } from 'react';
import { useStudio } from '../../context/StudioContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useStudio();
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const isDark = theme === 'dark';

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Create particles representing kinetic network nodes
    const particleCount = Math.min(Math.floor((width * height) / 10000), 55);
    const colors = isDark
      ? ['#6366F1', '#8B5CF6', '#818CF8', '#A855F7', '#38BDF8']
      : ['#4F46E5', '#7C3AED', '#6366F1', '#9333EA', '#0284C7'];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2.5 + 1.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    // Mouse movement interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render subtle ambient central energy mesh
      const centerX = width * 0.65;
      const centerY = height * 0.45;
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, height) * 0.45
      );
      grad.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)');
      grad.addColorStop(0.5, isDark ? 'rgba(139, 92, 246, 0.06)' : 'rgba(124, 58, 237, 0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Pulse radius
        p.pulsePhase += p.pulseSpeed;
        const currentRadius = p.baseRadius + Math.sin(p.pulsePhase) * 0.6;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw kinetic connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.22 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? '#818CF8' : '#6366F1';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.9;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
