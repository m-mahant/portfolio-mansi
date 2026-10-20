'use client';

// High-performance theme-aware animated canvas background for the Intro experience.

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  colorType: 'primary' | 'secondary' | 'accent';
}

export const IntroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Read current theme colors from document root computed styles
    const getThemeColors = () => {
      const root = getComputedStyle(document.documentElement);
      return {
        primary: root.getPropertyValue('--color-primary').trim() || '#6366f1',
        secondary: root.getPropertyValue('--color-secondary').trim() || '#8b5cf6',
        accent: root.getPropertyValue('--color-accent').trim() || '#d97706',
        bg: root.getPropertyValue('--color-background').trim() || '#0f172a',
      };
    };

    let colors = getThemeColors();

    // Create particles
    const particleCount = isReducedMotion ? 12 : 28;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isReducedMotion ? 0 : 0.4),
      vy: (Math.random() - 0.5) * (isReducedMotion ? 0 : 0.4),
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      colorType: Math.random() > 0.6 ? 'primary' : Math.random() > 0.3 ? 'secondary' : 'accent',
    }));

    // Ambient floating light orb positions
    let orb1 = { x: width * 0.2, y: height * 0.3, vx: 0.2, vy: 0.15 };
    let orb2 = { x: width * 0.8, y: height * 0.7, vx: -0.15, vy: -0.2 };

    const render = () => {
      colors = getThemeColors();

      // Clear background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      // Render floating ambient glowing orbs
      if (!isReducedMotion) {
        orb1.x += orb1.vx;
        orb1.y += orb1.vy;
        if (orb1.x < 0 || orb1.x > width) orb1.vx *= -1;
        if (orb1.y < 0 || orb1.y > height) orb1.vy *= -1;

        orb2.x += orb2.vx;
        orb2.y += orb2.vy;
        if (orb2.x < 0 || orb2.x > width) orb2.vx *= -1;
        if (orb2.y < 0 || orb2.y > height) orb2.vy *= -1;
      }

      const grad1 = ctx.createRadialGradient(orb1.x, orb1.y, 0, orb1.x, orb1.y, width * 0.4);
      grad1.addColorStop(0, colors.primary + '33');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(orb2.x, orb2.y, 0, orb2.x, orb2.y, width * 0.45);
      grad2.addColorStop(0, colors.secondary + '33');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw particle connections & points
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = colors.primary;
            ctx.globalAlpha = (1 - dist / 140) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // Draw particle node
        const particleColor =
          p.colorType === 'primary'
            ? colors.primary
            : p.colorType === 'secondary'
            ? colors.secondary
            : colors.accent;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
