'use client';
import { useState, useRef, useEffect } from 'react';

type FieldState = 'idle' | 'focused' | 'filled' | 'error';
type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  state: FieldState;
  accentColor?: string;
  textarea?: boolean;
  error?: string;
}

function AnimatedField({
  label, type = 'text', value, onChange, onFocus, onBlur,
  state, accentColor = '#7C3AED', textarea = false, error,
}: FieldProps) {
  const isActive = state === 'focused' || state === 'filled';
  const isError = state === 'error';

  const borderColor = isError ? '#ef4444' : isActive ? accentColor : 'rgba(255,255,255,0.08)';
  const glowColor = isError ? 'rgba(239,68,68,0.2)' : isActive ? `${accentColor}30` : 'transparent';
  const labelColor = isError ? '#ef4444' : isActive ? accentColor : '#475569';

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e2e8f0',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 15,
    resize: 'none' as const,
    paddingTop: 8,
  };

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      {/* Border container */}
      <div style={{
        position: 'relative',
        padding: '20px 16px 10px',
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        background: 'rgba(255,255,255,0.02)',
        boxShadow: isActive || isError ? `0 0 0 3px ${glowColor}` : 'none',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}>
        {/* Animated bottom line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          borderRadius: '0 0 12px 12px',
          background: accentColor,
          transform: `scaleX(${isActive ? 1 : 0})`,
          transition: 'transform 0.3s cubic-bezier(0.25, 0.4, 0.25, 1)',
          transformOrigin: isActive ? 'left' : 'right',
        }} />

        {/* Floating label */}
        <label style={{
          position: 'absolute',
          left: 16,
          top: isActive ? 8 : '50%',
          transform: isActive ? 'translateY(0) scale(0.8)' : 'translateY(-50%) scale(1)',
          transformOrigin: 'left',
          color: labelColor,
          fontSize: 14,
          fontWeight: 500,
          transition: 'all 0.25s cubic-bezier(0.25, 0.4, 0.25, 1)',
          pointerEvents: 'none',
          letterSpacing: isActive ? '0.06em' : '0',
        }}>
          {label}
        </label>

        {/* Input */}
        {textarea ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={4}
            style={{ ...baseInputStyle, paddingTop: 12 }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            style={baseInputStyle}
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <p style={{
          color: '#ef4444',
          fontSize: 12,
          marginTop: 6,
          fontFamily: 'Space Mono, monospace',
          paddingLeft: 4,
        }}>
          ↑ {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ formState }: { formState: FormState }) {
  const configs = {
    idle: { label: 'Send Message', bg: 'rgba(124,58,237,0.2)', border: 'rgba(124,58,237,0.4)', color: '#a78bfa' },
    loading: { label: 'Sending...', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)', color: '#7C3AED' },
    success: { label: '✓ Message sent!', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
    error: { label: '✕ Try again', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
  };
  const c = configs[formState];

  return (
    <button
      type="submit"
      disabled={formState === 'loading' || formState === 'success'}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: 12,
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.color,
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 600,
        fontSize: 15,
        cursor: formState === 'loading' || formState === 'success' ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        letterSpacing: '0.02em',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Loading shimmer */}
      {formState === 'loading' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.2) 50%, transparent 100%)',
          animation: 'scan-move 1.5s ease infinite',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {formState === 'loading' ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Spinner /> Sending...
          </span>
        ) : c.label}
      </span>
    </button>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="20" strokeLinecap="round" />
    </svg>
  );
}

export default function InteractiveForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  type FieldName = 'name' | 'email' | 'subject' | 'message';
  const [fieldStates, setFieldStates] = useState<Record<FieldName, FieldState>>({
    name: 'idle',
    email: 'idle',
    subject: 'idle',
    message: 'idle',
  });

  const setFieldFocus = (field: FieldName, focused: boolean) => {
    setFieldStates(prev => ({
      ...prev,
      [field]: focused ? 'focused' : (getFieldValue(field) ? 'filled' : 'idle'),
    }));
  };

  const getFieldValue = (field: FieldName) => {
    return { name, email, subject, message }[field];
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!message.trim()) errs.message = 'Message cannot be empty';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Mark error fields
      const newStates = { ...fieldStates };
      (Object.keys(errs) as FieldName[]).forEach(k => { newStates[k] = 'error'; });
      setFieldStates(newStates);
      return;
    }

    setErrors({});
    setFormState('loading');

    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  const fields: { key: FieldName; label: string; type?: string; color: string; textarea?: boolean }[] = [
    { key: 'name',    label: 'Your name',    color: '#7C3AED' },
    { key: 'email',   label: 'Email address', type: 'email', color: '#06B6D4' },
    { key: 'subject', label: 'Subject',       color: '#F59E0B' },
    { key: 'message', label: 'Your message',  color: '#7C3AED', textarea: true },
  ];

  const values: Record<FieldName, string> = { name, email, subject, message };
  const setters: Record<FieldName, (v: string) => void> = { name: setName, email: setEmail, subject: setSubject, message: setMessage };

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scan-move { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>

      <p style={{ color: '#64748b', fontFamily: 'Space Mono, monospace', fontSize: 13, marginBottom: 32 }}>
        Each field has its own animation personality. Try focusing them.
      </p>

      <div style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit} noValidate>
          {fields.map(f => (
            <AnimatedField
              key={f.key}
              label={f.label}
              type={f.type}
              value={values[f.key]}
              onChange={v => {
                setters[f.key](v);
                if (errors[f.key]) {
                  setErrors(prev => { const n = {...prev}; delete n[f.key]; return n; });
                  setFieldStates(prev => ({ ...prev, [f.key]: 'focused' }));
                }
              }}
              onFocus={() => setFieldFocus(f.key, true)}
              onBlur={() => setFieldFocus(f.key, false)}
              state={fieldStates[f.key]}
              accentColor={f.color}
              textarea={f.textarea}
              error={errors[f.key]}
            />
          ))}

          <SubmitButton formState={formState} />
        </form>

        {formState === 'success' && (
          <div style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#34d399',
            fontFamily: 'Space Mono, monospace',
            fontSize: 13,
          }}>
            Message received. I'll be in touch soon.
          </div>
        )}
      </div>
    </div>
  );
}
