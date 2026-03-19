'use client';

import Link from 'next/link';
import { useState } from 'react';
import { sendContact } from '@/lib/api';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!name || !email || !message) return;
    try {
        const res = await sendContact({ name, email, subject, message });
        if (res.message === 'Message sent successfully') {
            setSubmitted(true);
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch {
        alert('Failed to send message. Please try again.');
    }
}

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.875rem',
    backgroundColor: '#f4f4f5',
    border: '1px solid #d4d4d8',
    borderRadius: '4px',
    color: '#18181b',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: '#f4f4f5', color: '#18181b', lineHeight: 1.5, fontSize: '14px', minHeight: '100vh' }}>
      <header style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', backgroundColor: '#f4f4f5', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#18181b' }}>Fiscal<span style={{ color: '#2b9d8f' }}>Core</span></Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', border: '1px solid #d4d4d8', color: '#18181b' }}>Log In</Link>
          <Link href="/register" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white' }}>Get Started</Link>
        </div>
      </header>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 40px 120px' }}>
        <span style={{ ...mono, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', display: 'block', marginBottom: '8px' }}>Get In Touch</span>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '64px' }}>Contact<span style={{ color: '#2b9d8f' }}>.</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '24px' }}>Get in touch</h2>
            <p style={{ color: '#71717a', lineHeight: 1.8, marginBottom: '48px', fontSize: '0.9375rem' }}>Have a question, found a bug, or want to share feedback? We'd love to hear from you. Fill out the form and we'll get back to you within 24 hours.</p>

            {[
              { code: 'CNT-01', label: 'Email', value: 'support@fiscalcore.com' },
              { code: 'CNT-02', label: 'Response Time', value: 'Within 24 hours' },
              { code: 'CNT-03', label: 'Hours', value: 'Mon–Fri, 9am–6pm EST' },
            ].map((item) => (
              <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #e4e4e7' }}>
                <span style={{ color: '#71717a', fontSize: '0.875rem' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.value}</span>
                  <span style={{ ...mono, fontSize: '0.65rem', color: '#2b9d8f' }}>{item.code}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          {submitted ? (
            <div style={{ backgroundColor: '#ebebec', borderRadius: '4px', padding: '48px', border: '1px solid #d4d4d8', textAlign: 'center' as const }}>
              <div style={{ ...mono, fontSize: '0.75rem', color: '#2b9d8f', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '16px' }}>MSG_SENT: OK</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>Message received<span style={{ color: '#2b9d8f' }}>.</span></h3>
              <p style={{ color: '#71717a' }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#ebebec', borderRadius: '4px', padding: '40px', border: '1px solid #d4d4d8', display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '8px', color: '#71717a' }}>Name</label>
                  <input style={inputStyle} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '8px', color: '#71717a' }}>Email</label>
                  <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '8px', color: '#71717a' }}>Subject</label>
                <input style={inputStyle} placeholder="What's this about?" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '8px', color: '#71717a' }}>Message</label>
                <textarea style={{ ...inputStyle, height: '140px', resize: 'vertical' as const }} placeholder="Tell us more..." value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <button onClick={handleSubmit} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '4px', backgroundColor: '#2b9d8f', color: 'white', border: 'none', cursor: 'pointer' }}>
                Send Message →
              </button>
            </div>
          )}
        </div>
      </main>

      <footer style={{ backgroundColor: '#1a1b1e', color: '#f4f4f5', padding: '40px', fontSize: '0.8125rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Fiscal<span style={{ color: '#2b9d8f' }}>Core</span> © 2025</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...mono, fontSize: '0.75rem', color: '#a1a1aa' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#2b9d8f', borderRadius: '50%' }} />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}