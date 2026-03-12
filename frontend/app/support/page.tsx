import Link from 'next/link';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Support() {
  const faqs = [
    { code: 'FAQ-01', q: 'How accurate are the tax calculations?', a: 'FiscalCore uses the official 2025 IRS federal tax brackets and standard deductions. Calculations are accurate for federal income tax estimation. State taxes and FICA are not currently included.' },
    { code: 'FAQ-02', q: 'Which filing statuses are supported?', a: 'We support all four IRS filing statuses: Single, Married Filing Jointly, Married Filing Separately, and Head of Household.' },
    { code: 'FAQ-03', q: 'How do I reset my password?', a: 'Password reset is coming soon. For now, please contact our support team at support@fiscalcore.com and we will assist you.' },
    { code: 'FAQ-04', q: 'Is my data secure?', a: 'Yes. Passwords are hashed with bcrypt and authentication uses HTTP-only cookies that are inaccessible to JavaScript. We do not sell or share your data.' },
    { code: 'FAQ-05', q: 'How do I download my tax report?', a: 'After calculating your taxes on the dashboard, an Estimated Summary section appears with a Download Report button. This generates a formatted .txt file with your full breakdown.' },
    { code: 'FAQ-06', q: 'Can I delete my account?', a: 'Yes. Contact us at support@fiscalcore.com with your registered email and we will permanently delete your account and all associated data within 48 hours.' },
  ];

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
        <span style={{ ...mono, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', display: 'block', marginBottom: '8px' }}>Help Center</span>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>Support<span style={{ color: '#2b9d8f' }}>.</span></h1>
        <p style={{ color: '#71717a', fontSize: '1rem', marginBottom: '64px', maxWidth: '480px' }}>Find answers to common questions or reach out to our team directly.</p>

        {/* Contact card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '80px' }}>
          {[
            { code: 'SUP-01', label: 'Email Support', value: 'support@fiscalcore.com', desc: 'Response within 24 hours' },
            { code: 'SUP-02', label: 'Response Time', value: '< 24 hrs', desc: 'Monday through Friday' },
            { code: 'SUP-03', label: 'System Status', value: 'OPERATIONAL', desc: 'All systems running normally' },
          ].map((card) => (
            <div key={card.code} style={{ backgroundColor: '#ebebec', borderRadius: '4px', padding: '32px', border: '1px solid #e4e4e7', position: 'relative' }}>
              <div style={{ ...mono, fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '12px' }}>{card.label}</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: card.value === 'OPERATIONAL' ? '#2b9d8f' : '#18181b' }}>{card.value}</div>
              <div style={{ fontSize: '0.8125rem', color: '#71717a' }}>{card.desc}</div>
              <div style={{ ...mono, position: 'absolute', bottom: '24px', right: '24px', fontSize: '0.65rem', color: '#2b9d8f', fontWeight: 600 }}>{card.code}</div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '40px' }}>Frequently Asked Questions<span style={{ color: '#2b9d8f' }}>.</span></h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.code}>
                  <td style={{ padding: '24px 16px', borderBottom: '1px solid #d4d4d8', verticalAlign: 'top', width: '40%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ ...mono, fontSize: '0.65rem', color: '#2b9d8f', fontWeight: 600, whiteSpace: 'nowrap' as const, paddingTop: '2px' }}>{faq.code}</span>
                      <span style={{ fontWeight: 600, color: '#18181b', lineHeight: 1.4 }}>{faq.q}</span>
                    </div>
                  </td>
                  <td style={{ padding: '24px 16px', borderBottom: '1px solid #d4d4d8', color: '#71717a', lineHeight: 1.7 }}>{faq.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '80px', backgroundColor: '#ebebec', borderRadius: '4px', padding: '48px', border: '1px solid #d4d4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>Still need help<span style={{ color: '#2b9d8f' }}>?</span></h3>
            <p style={{ color: '#71717a' }}>Our team is ready to assist you with any questions.</p>
          </div>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white' }}>
            Contact Us →
          </Link>
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