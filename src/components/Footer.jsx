import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="SiteSnap" className="footer-logo" />
          <span>SiteSnap</span>
        </div>

        <div className="footer-links">
          <a href="mailto:tanushsbuisness@gmail.com">Support</a>
          <span className="footer-sep">·</span>
          <a href="/privacy-policy">Privacy Policy</a>
          <span className="footer-sep">·</span>
          <a href="/terms-of-service">Terms of Service</a>
          <span className="footer-sep">·</span>
          <a href="/account-deletion">Account Deletion</a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} SiteSnap. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
