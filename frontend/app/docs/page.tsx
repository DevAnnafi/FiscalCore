import Link from 'next/link';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Docs() {
  const sections = [
    {
      code: 'DOC-01',
      title: 'Getting Started',
      items: [
        { label: 'Create an account', desc: 'Sign up at /register with your full name, email, and a password. No credit card required.' },
        { label: 'Log in', desc: 'Visit /login and enter your credentials. Authentication uses HTTP-only cookies for security.' },
        { label: 'Access your dashboard', desc: 'After login you are redirected to /dashboard where you can calculate taxes immediately.' },
      ],
    },
    {
      code: 'DOC-02',
      title: 'Tax Calculation',
      items: [
        { label: 'Select filing status', desc: 'Choose from Single, Married Filing Jointly, Married Filing Separately, or Head of Household.' },
        { label: 'Enter gross income', desc: 'Input your total annual gross income before any deductions.' },
        { label: 'Click Calculate Taxes', desc: 'Results appear instantly below the form including total tax, effective rate, and bracket breakdown.' },
      ],
    },
    {
      code: 'DOC-03',
      title: 'Understanding Results',
      items: [
        { label: 'Total Federal Tax', desc: 'The total amount of federal income tax owed based on your taxable income.' },
        { label: 'Effective Rate', desc: 'Your total tax divided by gross income — the average rate you pay across all income.' },
        { label: 'Marginal Rate', desc: 'The tax rate applied to your last dollar of income — the highest bracket you fall into.' },
        { label: 'Bracket Breakdown', desc: 'A visual breakdown showing how much of your income falls into each tax bracket and the tax owed per bracket.' },
      ],
    },
    {
      code: 'DOC-04',
      title: 'Downloading Reports',
      items: [
        { label: 'Calculate first', desc: 'A report can only be generated after running a tax calculation.' },
        { label: 'Click Download Report', desc: 'Find the button in the Estimated Summary card after calculating.' },
        { label: 'Report contents', desc: 'The pdf report includes your name, email, income details, tax summary, and full bracket breakdown.' },
      ],
    },
    {
      code: 'DOC-05',
      title: '2025 Tax Brackets (Single)',
      items: [
        { label: '10%', desc: '$0 – $11,925' },
        { label: '12%', desc: '$11,926 – $48,475' },
        { label: '22%', desc: '$48,476 – $103,350' },
        { label: '24%', desc: '$103,351 – $197,300' },
        { label: '32%', desc: '$197,301 – $250,525' },
        { label: '35%', desc: '$250,526 – $626,350' },
        { label: '37%', desc: '$626,351+' },
      ],
    },
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
        <span style={{ ...mono, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', display: 'block', marginBottom: '8px' }}>Reference</span>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '64px' }}>Documentation<span style={{ color: '#2b9d8f' }}>.</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '64px' }}>
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{ ...mono, fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px' }}>Contents</div>
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
            <div style={{ marginTop: '48px', padding: '16px', backgroundColor: '#ebebec', borderRadius: '4px', border: '1px solid #d4d4d8' }}>
              <div style={{ ...mono, fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '8px' }}>Version</div>
              <div style={{ ...mono, fontSize: '0.875rem', fontWeight: 600 }}>v1.0.0</div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>Tax Year 2025</div>
            </div>
          </aside>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '64px' }}>
            {sections.map((s) => (
              <div key={s.code} id={s.code}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <span style={{ ...mono, fontSize: '0.7rem', color: '#2b9d8f', fontWeight: 600 }}>{s.code}</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>{s.title}<span style={{ color: '#2b9d8f' }}>.</span></h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <tbody>
                    {s.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ padding: '16px', borderBottom: '1px solid #d4d4d8', fontWeight: 600, color: '#18181b', width: '30%', verticalAlign: 'top', ...mono, fontSize: '0.8rem' }}>{item.label}</td>
                        <td style={{ padding: '16px', borderBottom: '1px solid #d4d4d8', color: '#71717a', lineHeight: 1.7 }}>{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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