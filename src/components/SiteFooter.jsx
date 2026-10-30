import "./SiteFooter.css";

const INSTAGRAM_URL = "https://www.instagram.com/bhoomithrasena/";
const CONTACT_URL = "";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="feature-grid site-footer__grid">
        <p className="site-footer__eyebrow">BHOOMITHRASENA MEC</p>

        <h2 className="site-footer__heading">
          <span>CONNECT</span>
          <span>WITH US.</span>
        </h2>

        <p className="site-footer__intro">
          Have an idea, want to collaborate, or want to be part of our
          initiatives? Get in touch.
        </p>

        <div className="site-footer__contact site-footer__socials">
          <p className="site-footer__label">SOCIALS</p>
          <a
            className="site-footer__link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
          >
            Instagram <span aria-hidden="true">↗</span>
          </a>
          <span className="site-footer__handle">@bhoomithrasena</span>
        </div>

        <div className="site-footer__contact site-footer__get-in-touch">
          <p className="site-footer__label">GET IN TOUCH</p>
          <a
            className="site-footer__link"
            href={CONTACT_URL || undefined}
            aria-disabled={!CONTACT_URL}
          >
            Contact Us <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="site-footer__wordmark" aria-label="Bhoomithrasena MEC">
          <p>bms.mec</p>
          
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 BHOOMITHRASENA MEC</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}
