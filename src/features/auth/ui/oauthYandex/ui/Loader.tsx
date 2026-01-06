'use client';
import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-dark-900)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #333',
            borderRadius: '50%',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ fontSize: '18px', color: '#666' }}>Redirecting...</p>
      </div>
    </div>
  );
}
