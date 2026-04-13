'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EC4899'];
const LABELS = ['Violet', 'Cyan', 'Amber', 'Pink'];

const pages = [
  {
    id: 0,
    title: 'Start Here',
    body: 'Click a color below to see the transition mask animate between pages.',
    accent: '#7C3AED',
    bg: 'rgba(124,58,237,0.05)',
  },
  {
    id: 1,
    title: 'Cyan World',
    body: 'A neon mask swept across the screen and revealed this page beneath.',
    accent: '#06B6D4',
    bg: 'rgba(6,182,212,0.05)',
  },
  {
    id: 2,
    title: 'Amber Space',
    body: 'The mask slides in from left, covers everything, then retreats to reveal the destination.',
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.05)',
  },
  {
    id: 3,
    title: 'Neon Pink',
    body: 'Page transitions that feel intentional, not accidental. Motion with purpose.',
    accent: '#EC4899',
    bg: 'rgba(236,72,153,0.05)',
  },
];

export default function PageTransitionDemo() {
  const [currentPage, setCurrentPage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [maskColor, setMaskColor] = useState('#7C3AED');
  const [maskPhase, setMaskPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const [nextPage, setNextPage] = useState(0);

  const navigate = (targetPage: number, color: string) => {
    if (transitioning || targetPage === currentPage) return;
    setTransitioning(true);
    setMaskColor(color);
    setNextPage(targetPage);
    setMaskPhase('cover');

    // After cover completes, switch page and start reveal
    setTimeout(() => {
      setCurrentPage(targetPage);
      setMaskPhase('reveal');
    }, 500);

    // After reveal completes, reset
    setTimeout(() => {
      setMaskPhase('idle');
      setTransitioning(false);
    }, 1000);
  };

  const page = pages[currentPage];

  return (
    <div>
      <p style={{ color: '#64748b', fontFamily: 'Space Mono, monospace', fontSize: 13, marginBottom: 32 }}>
        Click a color to trigger the page transition mask.
      </p>

      {/* Page viewport */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        background: page.bg,
        minHeight: 320,
        padding: 40,
        transition: 'background 0.3s ease',
      }}>
        {/* Mask layer */}
        <AnimatePresence>
          {maskPhase === 'cover' && (
            <motion.div
              key="cover"
              initial={{ scaleX: 0, originX: '0%' }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                background: maskColor,
                zIndex: 10,
                transformOrigin: 'left',
              }}
            />
          )}
          {maskPhase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ scaleX: 1, originX: '100%' }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                background: maskColor,
                zIndex: 10,
                transformOrigin: 'right',
              }}
            />
          )}
        </AnimatePresence>

        {/* Page content */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01 }}
        >
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            color: page.accent,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Page {currentPage + 1} of {pages.length}
          </div>
          <h2 style={{
            fontSize: 42,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            lineHeight: 1.1,
          }}>
            {page.title}
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 400, lineHeight: 1.7 }}>
            {page.body}
          </p>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
            {pages.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentPage ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === currentPage ? page.accent : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => navigate(i, color)}
            disabled={transitioning}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: `1px solid ${color}40`,
              background: currentPage === i ? `${color}20` : 'rgba(255,255,255,0.02)',
              color: currentPage === i ? color : '#64748b',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              cursor: transitioning ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: transitioning ? 0.5 : 1,
            }}
          >
            {LABELS[i]}
          </button>
        ))}
      </div>

      {/* Explanation */}
      <div style={{
        marginTop: 32,
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
      }}>
        <p style={{ color: '#475569', fontFamily: 'Space Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          How it works
        </p>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
          Two-phase mask animation: <code style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: 4 }}>scaleX 0→1</code> covers the screen
          with a neon color using a <code style={{ color: '#22d3ee', background: 'rgba(6,182,212,0.1)', padding: '2px 6px', borderRadius: 4 }}>cubic-bezier</code> that starts slow and
          rockets to completion. Then the page swaps, and <code style={{ color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>scaleX 1→0</code> peels away from right to reveal the new content.
        </p>
      </div>
    </div>
  );
}
