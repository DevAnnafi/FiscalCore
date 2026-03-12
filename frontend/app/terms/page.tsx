import Link from 'next/link';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Terms() {
  const sections = [
    { code: 'TRM-01', title: 'Acceptance of Terms', content: 'By accessing or using FiscalCore, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our service.' },
    { code: 'TRM-02', title: 'Description of Service', content: 'FiscalCore provides federal tax estimation tools based on IRS-published brackets for the 2025 tax year. Our service is for informational purposes only and does not constitute professional tax advice.' },
    { code: 'TRM-03', title: 'User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must provide accurate and complete information when creating your account.' },
    { code: 'TRM-04', title: 'Acceptable Use', content: 'You agree not to use FiscalCore for any unlawful purpose, to attempt to gain unauthorized access to any part of the service, to interfere with or disrupt the service, or to reverse engineer any part of the application.' },
    { code: 'TRM-05', title: 'Disclaimer of Warranties', content: 'FiscalCore is provided "as is" without warranties of any kind. While we strive for accuracy, tax calculations are estimates only. Always consult a qualified tax professional for official tax advice and filing.' },
    { code: 'TRM-06', title: 'Limitation of Liability', content: 'FiscalCore shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to errors in tax calculations or decisions made based on our estimates.' },
    { code: 'TRM-07', title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email. Continued use of the service after changes constitutes acceptance of the new terms.' },
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
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>Terms of Service<span style={{ color: '#2b9d8f' }}>.</span></h1>
        <p style={{ color: '#71717a', marginBottom: '64px', ...mono, fontSize: '0.75rem' }}>Last updated: January 1, 2025</p>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '64px' }}>
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