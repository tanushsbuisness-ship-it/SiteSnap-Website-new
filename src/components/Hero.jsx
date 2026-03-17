import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-badge">Now Available on iOS</div>
          <h1 className="hero-title">
            Document Every Site.<br />
            <span className="hero-accent">Professionally.</span>
          </h1>
          <p className="hero-sub">
            SiteSnap helps contractors, inspectors, and field teams capture,
            organize, and share job-site photos — by project, with GPS data,
            all in one place.
          </p>
          <div className="hero-actions">
            <a
              id="download"
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

        <div className="hero-visual">
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="mock-header">
                <span className="mock-greeting">My Projects</span>
                <div className="mock-avatar" />
              </div>
              <div className="mock-projects">
                {['Riverside Build', 'Oak Street Reno', 'North Site Inspection'].map((name, i) => (
                  <div className="mock-project-card" key={i}>
                    <div className="mock-thumb" style={{ '--hue': `${i * 40}deg` }} />
                    <div className="mock-info">
                      <div className="mock-title">{name}</div>
                      <div className="mock-meta">{12 - i * 3} photos</div>
                    </div>
                    <div className="mock-chevron">›</div>
                  </div>
                ))}
              </div>
              <div className="mock-fab">+</div>
            </div>
          </div>
          <div className="hero-ring ring-1" />
          <div className="hero-ring ring-2" />
        </div>
      </div>
    </section>
  )
}
