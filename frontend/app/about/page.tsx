import Link from 'next/link';

const styles = {
  page: { fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: '#f4f4f5', color: '#18181b', lineHeight: 1.5, fontSize: '14px', minHeight: '100vh' },
  header: { padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', backgroundColor: '#f4f4f5', position: 'sticky' as const, top: 0, zIndex: 100 },
  logo: { fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#18181b' },
  container: { maxWidth: '1440px', margin: '0 auto', padding: '0 40px' },
  mono: { fontFamily: "'JetBrains Mono', monospace" },
};

export default function About() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.logo}>Fiscal<span style={{ color: '#2b9d8f' }}>Core</span></Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', border: '1px solid #d4d4d8', color: '#18181b' }}>Log In</Link>
          <Link href="/register" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white' }}>Get Started</Link>
        </div>
      </header>

      <main style={{ ...styles.container, padding: '80px 40px 120px' }}>
        <span style={{ ...styles.mono, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', display: 'block', marginBottom: '8px' }}>Company</span>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '64px' }}>About<span style={{ color: '#2b9d8f' }}>.</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '80px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '24px' }}>Our Mission</h2>
            <p style={{ color: '#71717a', fontSize: '1rem', lineHeight: 1.8, marginBottom: '24px' }}>FiscalCore was built with a simple belief: every individual deserves access to accurate, transparent tax information without the complexity.</p>
            <p style={{ color: '#71717a', fontSize: '1rem', lineHeight: 1.8 }}>We combine up-to-date IRS bracket data with a clean, fast interface so you can understand your federal tax liability in seconds — not hours.</p>
          </div>
          <div style={{ backgroundColor: '#ebebec', borderRadius: '4px', padding: '40px', border: '1px solid #d4d4d8' }}>
            <div style={{ ...styles.mono, fontSize: '0.75rem', color: '#71717a', marginBottom: '32px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>System Info</div>
            {[
              { label: 'Founded', value: '2025' },
              { label: 'Tax Year', value: '2025' },
              { label: 'Filing Statuses', value: '4 supported' },
              { label: 'Bracket Accuracy', value: '100% IRS-aligned' },
              { label: 'Status', value: 'OPERATIONAL' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #d4d4d8' }}>
                <span style={{ color: '#71717a', fontSize: '0.875rem' }}>{row.label}</span>
                <span style={{ ...styles.mono, fontSize: '0.8rem', color: '#18181b', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #d4d4d8', paddingTop: '64px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '40px' }}>Core Values<span style={{ color: '#2b9d8f' }}>.</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { code: 'VAL-01', title: 'Accuracy', desc: 'Every calculation is based on the latest IRS published tax brackets and standard deductions.' },
              { code: 'VAL-02', title: 'Transparency', desc: 'We show you every bracket, every deduction, every number — no black boxes.' },
              { code: 'VAL-03', title: 'Simplicity', desc: 'Complex tax math presented in a clean, intuitive interface anyone can use.' },
            ].map((card) => (
              <div key={card.code} style={{ backgroundColor: '#ebebec', borderRadius: '4px', padding: '32px', position: 'relative', minHeight: '200px', border: '1px solid #e4e4e7' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>{card.title}<span style={{ color: '#2b9d8f' }}>.</span></h3>
                <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.6 }}>{card.desc}</p>
                <div style={{ ...styles.mono, position: 'absolute', bottom: '24px', right: '24px', fontSize: '0.75rem', color: '#2b9d8f', fontWeight: 600 }}>{card.code}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#1a1b1e', color: '#f4f4f5', padding: '40px', fontSize: '0.8125rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Fiscal<span style={{ color: '#2b9d8f' }}>Core</span> © 2025</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...styles.mono, fontSize: '0.75rem', color: '#a1a1aa' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#2b9d8f', borderRadius: '50%' }} />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}