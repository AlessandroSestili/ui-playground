'use client';
import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';
  className?: string;
  style?: React.CSSProperties;
}

function Reveal({ children, delay = 0, direction = 'up', className, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const controls = useAnimation();

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      scale: direction === 'scale' ? 0.85 : 1,
      filter: direction === 'blur' ? 'blur(12px)' : 'blur(0px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Split text reveal - each word animates independently
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const words = text.split(' ');

  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotateX: -60 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.06,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{
            display: 'inline-block',
            transformOrigin: '50% 100%',
            perspective: '800px',
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// Horizontal line reveal
function LineReveal({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0, originX: 0 }}
      animate={isInView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      style={{
        height: 1,
        background: 'linear-gradient(90deg, var(--violet), var(--cyan), transparent)',
        transformOrigin: 'left',
        marginBottom: 32,
      }}
    />
  );
}

// Stagger container
function StaggerGrid({ items }: { items: { title: string; desc: string; color: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ color: item.color, fontFamily: 'Space Mono, monospace', fontSize: 11, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {item.title}
          </div>
          <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
            {item.desc}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ScrollReveal() {
  return (
    <div style={{ color: '#e2e8f0' }}>
      <p style={{ color: '#64748b', fontFamily: 'Space Mono, monospace', fontSize: 13, marginBottom: 48 }}>
        Scroll down to trigger cinematic reveal animations.
      </p>

      {/* Section 1 — simple fade up */}
      <div style={{ minHeight: '50vh', paddingTop: 32 }}>
        <Reveal>
          <p style={{ color: '#7C3AED', fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            01 — fade up
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, marginBottom: 16, color: '#fff' }}>
            Simple. Elegant.<br />Effortless.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 480, lineHeight: 1.8 }}>
            The classic fade-up. Clean entry with an ease curve that feels premium, not mechanical.
          </p>
        </Reveal>
        <LineReveal delay={0.3} />
      </div>

      {/* Section 2 — word by word */}
      <div style={{ minHeight: '40vh', paddingTop: 32 }}>
        <Reveal>
          <p style={{ color: '#06B6D4', fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            02 — word by word
          </p>
        </Reveal>
        <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginBottom: 24, color: '#fff' }}>
          <WordReveal text="Each word drops in" delay={0.05} />
          <WordReveal text="with perspective depth" delay={0.4} />
        </div>
        <Reveal delay={0.2} direction="blur">
          <p style={{ color: '#64748b', fontSize: 14, maxWidth: 400 }}>
            Words cascade with a 3D rotation on the X axis, creating depth perception in 2D space.
          </p>
        </Reveal>
        <LineReveal delay={0.3} />
      </div>

      {/* Section 3 — directional */}
      <div style={{ minHeight: '40vh', paddingTop: 32 }}>
        <Reveal>
          <p style={{ color: '#F59E0B', fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
            03 — directional entries
          </p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
          {(['left', 'right', 'scale', 'blur'] as const).map((dir, i) => (
            <Reveal key={dir} direction={dir} delay={i * 0.1}>
              <div style={{
                padding: 20,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
              }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#a78bfa', marginBottom: 6 }}>from {dir}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>Enters from the {dir} side with smooth easing</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <LineReveal delay={0.4} />
        </div>
      </div>

      {/* Section 4 — stagger grid */}
      <div style={{ minHeight: '40vh', paddingTop: 32 }}>
        <Reveal>
          <p style={{ color: '#7C3AED', fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
            04 — stagger grid
          </p>
        </Reveal>
        <StaggerGrid items={[
          { title: 'Intersection Observer', desc: 'Triggers only when element enters viewport, not on page load.', color: '#a78bfa' },
          { title: 'Framer Motion', desc: 'Declarative animation API with smooth spring physics.', color: '#22d3ee' },
          { title: 'Once: true', desc: 'Each element animates in exactly once — no replay on scroll up.', color: '#fbbf24' },
        ]} />
      </div>
    </div>
  );
}
