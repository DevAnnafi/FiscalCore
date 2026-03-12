'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: '#f4f4f5', color: '#18181b', lineHeight: 1.5, fontSize: '14px', overflowX: 'hidden' }}>

      {/* Header */}
      <header style={{ padding: '24px 40px', display: 'grid', gridTemplateColumns: '200px 1fr 200px', alignItems: 'center', borderBottom: '1px solid #e4e4e7', backgroundColor: '#f4f4f5', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Fiscal<span style={{ color: '#2b9d8f' }}>Core</span>
        </div>
        <nav style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
           {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Docs', href: '/docs' },
          ].map(({label, href}) => (
            <a key={label} href={href} style={{ textDecoration: 'none', color: '#71717a', fontSize: '0.875rem', fontWeight: 500 }}>{label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', border: '1px solid #d4d4d8', color: '#18181b', backgroundColor: 'transparent' }}>
            Log In
          </Link>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white', border: '1px solid transparent' }}>
            Get Started
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section style={{ padding: '120px 40px', borderBottom: '1px solid #d4d4d8', maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-start' }}>
              <h1 style={{ fontSize: '4.5rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#18181b' }}>
                Know exactly what you owe<span style={{ color: '#2b9d8f' }}>.</span>
              </h1>
              <p style={{ fontSize: '1.125rem', maxWidth: '480px', color: '#71717a' }}>
                Precision federal tax calculations for every filing status. Accurate 2025 bracket data, instant results, downloadable reports.
              </p>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white', marginTop: '16px' }}>
                Start Calculating <span>→</span>
              </Link>
            </div>

            {/* UI Graphic */}
            <div style={{ backgroundColor: '#ebebec', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #d4d4d8', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2b9d8f', boxShadow: '0 0 0 4px rgba(43,157,143,0.2)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #d4d4d8', paddingBottom: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a' }}>Federal Tax Estimate</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>TY-2025</span>
              </div>

              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', gap: '16px', padding: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#71717a' }}>
                <span>FILING_STATUS</span>
                <span>TAXABLE_INCOME</span>
                <span style={{ textAlign: 'right' }}>TAX_DUE</span>
              </div>

              {[
                { status: 'SINGLE', income: '$75,000', tax: '$12,168', active: true },
                { status: 'MFJ', income: '$120,000', tax: '$14,382', active: false },
                { status: 'HOH', income: '$90,000', tax: '$13,641', active: false },
                { status: 'MFS', income: '$60,000', tax: '$10,294', active: false },
              ].map((row) => (
                <div key={row.status} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', gap: '16px', alignItems: 'center', padding: '12px', backgroundColor: '#f4f4f5', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', border: `1px solid ${row.active ? '#2b9d8f' : 'transparent'}` }}>
                  <span>{row.status}</span>
                  <span>{row.income}</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <span>{row.tax}</span>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: row.active ? '#2b9d8f' : '#d4d4d8' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: '80px 40px', borderBottom: '1px solid #d4d4d8', maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
            <div>
              <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '8px' }}>Architecture</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Features<span style={{ color: '#2b9d8f' }}>.</span></h2>
            </div>
            <p style={{ color: '#71717a', textAlign: 'right', fontSize: '0.875rem' }}>Built for accuracy.<br />Designed for clarity.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { num: '1.', code: 'TAX-01', badge: 'CORE', title: 'Accurate Calculations', desc: 'Up-to-date 2025 federal tax brackets for all filing statuses. Standard deductions applied automatically.' },
              { num: '2.', code: 'TAX-02', badge: null, title: 'All Filing Statuses', desc: 'Supports Single, Married Filing Jointly, Married Filing Separately, and Head of Household.' },
              { num: '3.', code: 'TAX-03', badge: null, title: 'Visual Breakdown', desc: 'See exactly how your income falls across each tax bracket with an interactive bar chart.' },
            ].map((card) => (
              <div key={card.num} style={{ backgroundColor: '#ebebec', borderRadius: '4px', padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '320px', position: 'relative', overflow: 'hidden', transition: 'background-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {card.badge ? (
                    <span style={{ display: 'inline-flex', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #d4d4d8', borderRadius: '99px', color: '#71717a' }}>{card.badge}</span>
                  ) : <span />}
                </div>
                <div style={{ marginTop: '48px', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>{card.title}<span style={{ color: '#2b9d8f' }}>.</span></h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#71717a', maxWidth: '90%' }}>{card.desc}</p>
                </div>
                <div style={{ position: 'absolute', bottom: '32px', left: '32px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 500, color: '#71717a' }}>{card.num}</div>
                <div style={{ position: 'absolute', bottom: '32px', right: '32px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.875rem', color: '#2b9d8f' }}>{card.code}</div>
                {/* Decorative corner */}
                <div style={{ position: 'absolute', bottom: 0, right: '-20%', width: '70%', height: '55%', borderTop: '1px solid #d4d4d8', borderLeft: '1px solid #d4d4d8', borderTopLeftRadius: '8px', background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)' }} />
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" style={{ padding: '80px 40px 120px', maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '64px' }}>
            <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '8px' }}>Process</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>How It Works<span style={{ color: '#2b9d8f' }}>.</span></h2>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#71717a', width: '30%' }}>Step</th>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#71717a' }}>Action</th>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#71717a', backgroundColor: '#ebebec', border: '1px solid #d4d4d8' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {[
                { step: '01 — Create Account', action: 'Sign up with your name and email. No credit card required.', result: 'Secure account with HTTP-only cookie auth', highlight: false },
                { step: '02 — Enter Income', action: 'Input your gross annual income and select your filing status.', result: 'Instant 2025 federal tax calculation', highlight: true },
                { step: '03 — Review Results', action: 'See your total tax, effective rate, marginal rate, and bracket breakdown.', result: 'Full tax liability picture in seconds', highlight: false },
                { step: '04 — Download Report', action: 'Export a detailed tax report with all figures for your records.', result: 'Formatted .txt report ready to share', highlight: true },
              ].map((row) => (
                <tr key={row.step}>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#18181b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{row.step}</td>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', color: '#71717a' }}>{row.action}</td>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', backgroundColor: '#ebebec', borderLeft: '1px solid #d4d4d8', borderRight: '1px solid #d4d4d8', color: '#2b9d8f', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{row.result}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '32px 16px' }} />
                <td style={{ padding: '32px 16px' }}>
                  <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white' }}>
                    Get Started →
                  </Link>
                </td>
                <td style={{ backgroundColor: '#ebebec', borderLeft: '1px solid #d4d4d8', borderRight: '1px solid #d4d4d8', borderBottom: '1px solid #d4d4d8', padding: '32px 16px' }}>
                  <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', border: '1px solid #d4d4d8', color: '#18181b' }}>
                    Log In
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '80px 40px 120px', borderTop: '1px solid #d4d4d8', maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '64px' }}>
            <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '8px' }}>Deployment Models</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Pricing<span style={{ color: '#2b9d8f' }}>.</span></h2>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#71717a', width: '30%' }}>Plan Specifications</th>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#71717a' }}>Free</th>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#18181b', backgroundColor: '#ebebec', border: '1px solid #d4d4d8', borderRadius: '4px 4px 0 0' }}>Pro</th>
                <th style={{ padding: '20px 16px', textAlign: 'left', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#71717a' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { spec: 'Monthly Price', free: '$0 / mo', pro: '$20 / mo', enterprise: 'Custom' },
                { spec: 'Tax Calculations', free: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
                { spec: 'Filing Statuses', free: 'All 4', pro: 'All 4', enterprise: 'All 4' },
                { spec: 'Downloadable Reports', free: '—', pro: '✓', enterprise: '✓' },
                { spec: 'Saved Scenarios', free: '—', pro: 'Up to 20', enterprise: 'Unlimited' },
                { spec: 'API Access', free: '—', pro: '—', enterprise: '✓' },
                { spec: 'Priority Support', free: '—', pro: '✓', enterprise: '✓' },
                { spec: 'SLA', free: 'Best effort', pro: '99.9%', enterprise: '99.99%' },
              ].map((row) => (
                <tr key={row.spec}>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', fontWeight: 500, color: '#18181b' }}>{row.spec}</td>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', color: '#71717a' }}>{row.free}</td>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', backgroundColor: '#ebebec', borderLeft: '1px solid #d4d4d8', borderRight: '1px solid #d4d4d8', color: row.pro === '✓' ? '#2b9d8f' : '#18181b', fontWeight: row.pro === '✓' ? 600 : 400 }}>{row.pro}</td>
                  <td style={{ padding: '20px 16px', borderBottom: '1px solid #d4d4d8', color: '#71717a' }}>{row.enterprise}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '32px 16px' }} />
                <td style={{ padding: '32px 16px' }}>
                  <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', border: '1px solid #d4d4d8', color: '#18181b' }}>
                    Get Started
                  </Link>
                </td>
                <td style={{ padding: '32px 16px', backgroundColor: '#ebebec', borderLeft: '1px solid #d4d4d8', borderRight: '1px solid #d4d4d8', borderBottom: '1px solid #d4d4d8' }}>
                  <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', backgroundColor: '#2b9d8f', color: 'white' }}>
                    Start Pro →
                  </Link>
                </td>
                <td style={{ padding: '32px 16px' }}>
                  <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '4px', textDecoration: 'none', border: '1px solid #d4d4d8', color: '#18181b' }}>
                    Contact Us
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </section>        
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a1b1e', color: '#f4f4f5', padding: '80px 40px 40px', fontSize: '0.8125rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '64px', marginBottom: '80px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', marginBottom: '24px' }}>
                Fiscal<span style={{ color: '#2b9d8f' }}>Core</span>
              </div>
              <p style={{ color: '#a1a1aa', maxWidth: '250px' }}>Precision federal tax calculations for individuals and households.</p>
            </div>
              {[
                { title: 'Product', links: [
                { label: 'Tax Calculator', href: '/dashboard' },
                { label: 'Filing Statuses', href: '#features' },
                { label: 'Bracket Data', href: '/docs#DOC-05' },
                { label: 'Reports', href: '/docs#DOC-04' },
              ]},
              { title: 'Resources', links: [
                { label: 'Documentation', href: '/docs' },
                { label: 'API Reference', href: '/docs' },
                { label: 'Support', href: '/support' },
                { label: 'System Status', href: '/support' },
              ]},
              { title: 'Company', links: [
                { label: 'About', href: '/about' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Contact', href: '/contact' },
              ]},
            ].map((col) => (
              <div key={col.title}>
                <h5 style={{ color: '#a1a1aa', marginBottom: '24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.title}</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.links.map((link) => (
                    <li key={link.label}><a href={link.href} style={{ color: '#f4f4f5', textDecoration: 'none', opacity: 0.7 }}>{link.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>
            <div>© 2025 FiscalCore. All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#2b9d8f', borderRadius: '50%' }} />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}