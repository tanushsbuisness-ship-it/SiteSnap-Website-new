import './HowItWorks.css'

const steps = [
  {
    num: '01',
    title: 'Create a Project',
    desc: 'Start a new project for each job site. Name it, save it, and you\'re ready to go.',
  },
  {
    num: '02',
    title: 'Snap & Organise',
    desc: 'Take photos on-site or import from your library. SiteSnap tags each one with the timestamp and GPS location.',
  },
  {
    num: '03',
    title: 'Review & Share',
    desc: 'Browse your project timeline, export photos, and share progress with clients or your team.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how">
      <div className="how-inner">
        <div className="how-text">
          <div className="section-label">How it works</div>
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            From first nail to final walkthrough
          </h2>
          <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 48px' }}>
            Three simple steps to keep every job site documented perfectly.
          </p>

          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="how-visual">
          <div className="cta-card">
            <img src="/logo.png" alt="SiteSnap" className="cta-logo" />
            <h3>Ready to bring order to your job site?</h3>
            <p>Download SiteSnap free today and start documenting like a pro.</p>
            <a
              className="btn-primary"
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
