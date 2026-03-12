import type { CSSProperties } from 'react';

type Styles = Record<string, CSSProperties>;

export const formStyles: Styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
  },
  title: {
    margin: '0 0 6px', fontSize: '1.8rem', fontWeight: 700,
    color: '#1a1a2e', textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px', color: '#666', textAlign: 'center', fontSize: '0.95rem',
  },
  field: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: 600, color: '#333', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '11px 14px', border: '2px solid #e0e0e0',
    borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s', color: '#333',
  },
  button: {
    width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: 600, cursor: 'pointer', marginTop: '6px',
  },
  error: {
    background: '#fff5f5', border: '1px solid #f5c6cb', color: '#721c24',
    padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem',
  },
  success: {
    background: '#f0fff4', border: '1px solid #c3e6cb', color: '#155724',
    padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem',
  },
  link: { textAlign: 'center', marginTop: '16px', color: '#555', fontSize: '0.9rem' },
};
