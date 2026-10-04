"use client";

import { useEffect, useState } from "react";

export function GoldenEmbers() {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    // Generate subtle glowing ambient ember particles
    const items = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 10 + Math.random() * 85,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 14,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 opacity-0 blur-[0.5px] shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `floatEmbers ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
