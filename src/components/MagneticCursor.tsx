'use client';
import { useEffect, useRef, useState } from 'react';

interface MagneticElement {
  el: HTMLElement;
  rect: DOMRect;
}

export default function MagneticCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;
    let activeMagnetic: MagneticElement | null = null;

    const magneticEls: MagneticElement[] = [];

    // Register magnetic elements
    const buttons = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    buttons.forEach(el => {
      magneticEls.push({ el, rect: el.getBoundingClientRect() });
    });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update magnetic element rects
      magneticEls.forEach(m => {
        m.rect = m.el.getBoundingClientRect();
      });

      // Check magnetic attraction
      activeMagnetic = null;
      for (const m of magneticEls) {
        const cx = m.rect.left + m.rect.width / 2;
        const cy = m.rect.top + m.rect.height / 2;
        const dist = Math.hypot(mouseX - cx, mouseY - cy);
        const threshold = Math.max(m.rect.width, m.rect.height) * 0.9;

        if (dist < threshold) {
          activeMagnetic = m;
          const strength = 1 - dist / threshold;
          const dx = (mouseX - cx) * strength * 0.4;
          const dy = (mouseY - cy) * strength * 0.4;
          m.el.style.transform = `translate(${dx}px, ${dy}px)`;
          setIsHovering(true);
        } else {
          m.el.style.transform = 'translate(0px, 0px)';
        }
      }

      if (!activeMagnetic) setIsHovering(false);
    };

    const animate = () => {
      // Smooth ring lag
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dot) {
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
      if (ring) {
        ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      // Reset all magnetic elements
      magneticEls.forEach(m => {
        m.el.style.transform = 'translate(0px, 0px)';
      });
    };
  }, []);

  return (
    <>
      {/* Custom cursor elements */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--cyan)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={cursorRingRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `2px solid ${isHovering ? 'var(--violet)' : 'rgba(6,182,212,0.5)'}`,
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'border-color 0.3s ease, transform 0s',
          boxShadow: isHovering ? '0 0 20px var(--violet-glow)' : 'none',
        }}
      />

      {/* Demo area */}
      <div style={{ cursor: 'none' }}>
        <p style={{ color: '#64748b', fontFamily: 'Space Mono, monospace', fontSize: 13, marginBottom: 32 }}>
          Move your cursor — magnetic elements pull it in.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
          {['Primary Action', 'Secondary', 'Explore →'].map((label, i) => {
            const colors = [
              { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.4)', color: '#a78bfa' },
              { bg: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.4)',  color: '#22d3ee' },
              { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', color: '#fbbf24' },
            ];
            const c = colors[i];
            return (
              <button
                key={label}
                data-magnetic
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.color,
                  padding: '14px 32px',
                  borderRadius: 12,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  transition: 'transform 0.1s ease, box-shadow 0.3s ease',
                  cursor: 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Magnetic circles */}
        <p style={{ color: '#475569', fontFamily: 'Space Mono, monospace', fontSize: 12, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Also try these:
        </p>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { size: 80, color: '#7C3AED', label: 'DRAG' },
            { size: 60, color: '#06B6D4', label: 'ME' },
            { size: 100, color: '#F59E0B', label: 'PULL' },
            { size: 70, color: '#7C3AED', label: '→' },
          ].map(({ size, color, label }, i) => (
            <div
              key={i}
              data-magnetic
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `2px solid ${color}`,
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                fontFamily: 'Space Mono, monospace',
                fontSize: 12,
                fontWeight: 700,
                transition: 'transform 0.1s ease',
                cursor: 'none',
                boxShadow: `0 0 20px ${color}30`,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{
          marginTop: 64,
          padding: 24,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 16,
        }}>
          <p style={{ color: '#475569', fontFamily: 'Space Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How it works</p>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
            On each <code style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: 4 }}>mousemove</code>, the distance between the cursor and each magnetic element is calculated.
            If within range, the element's <code style={{ color: '#22d3ee', background: 'rgba(6,182,212,0.1)', padding: '2px 6px', borderRadius: 4 }}>translate</code> is set proportionally to create gravity.
            The custom cursor uses <code style={{ color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>requestAnimationFrame</code> for buttery-smooth lag.
          </p>
        </div>
      </div>
    </>
  );
}
