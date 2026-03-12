import Link from 'next/link';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Privacy() {
  const sections = [
    { code: 'PRV-01', title: 'Information We Collect', content: 'We collect your name, email address, and the income figures you enter to calculate your taxes. We do not collect your Social Security Number, bank account details, or any government-issued ID.' },
    { code: 'PRV-02', title: 'How We Use Your Data', content: 'Your data is used solely to provide tax calculation services. We use your email to authenticate your account. Income figures you enter are processed in real-time and are not permanently stored unless you explicitly save a scenario.' },
    { code: 'PRV-03', title: 'Authentication & Security', content: 'Authentication is handled via JWT tokens stored in HTTP-only cookies, which are inaccessible to JavaScript and protect against XSS attacks. Passwords are hashed using bcrypt before storage.' },
    { code: 'PRV-04', title: 'Data Sharing', content: 'We do not sell, trade, or share your personal information with third parties. We do not use advertising networks or allow advertisers to target you based on your data.' },
    { code: 'PRV-05', title: 'Data Retention', content: 'Account data is retained for as long as your account is active. You may request deletion of your account and associated data at any time by contacting support.' },
    { code: 'PRV-06', title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data. You may also request a copy of all data we hold about you. Contact us at privacy@fiscalcore.com to exercise these rights.' },
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
        <span style={{ ...mono, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', display: 'block', marginBottom: '8px' }}>Legal</span>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>Privacy Policy<span style={{ color: '#2b9d8f' }}>.</span></h1>
        <p style={{ color: '#71717a', marginBottom: '64px', ...mono, fontSize: '0.75rem' }}>Last updated: January 1, 2025</p>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '64px' }}>
          {/* Sidebar nav */}
          <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{ ...mono, fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px' }}>Sections</div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {sections.map((s) => (
                <li key={s.code}>
                  <a href={`#${s.code}`} style={{ textDecoration: 'none', color: '#71717a', fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{s.title}</span>
                    <span style={{ ...mono, fontSize: '0.65rem', color: '#a1a1aa' }}>{s.code}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '48px' }}>
            {sections.map((s) => (
              <div key={s.code} id={s.code} style={{ paddingBottom: '48px', borderBottom: '1px solid #d4d4d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ ...mono, fontSize: '0.7rem', color: '#2b9d8f', fontWeight: 600 }}>{s.code}</span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{s.title}</h2>
                </div>
                <p style={{ color: '#71717a', lineHeight: 1.8, fontSize: '0.9375rem' }}>{s.content}</p>
              </div>
            ))}
          </div>
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