import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import About from "./About";
import GridOverlay from "./GridOverlay";
import Initiatives from "./Initiatives";
import LeafTransition from "./LeafTransition";
import EventsSection from "./EventsSection";
import UpcomingSection from "./components/UpcomingSection";
import BeliefSection from "./components/BeliefSection";
import SiteFooter from "./components/SiteFooter";
import NavigationMenu from "./components/NavigationMenu";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const loadingScreenRef = useRef(null);
  const loadingProgressRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useLayoutEffect(() => {
    if (!isLoading) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setIsLoading(false) })
        .to(loadingProgressRef.current, {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.inOut",
        })
        .to(
          loadingScreenRef.current,
          {
            yPercent: -100,
            duration: 0.5,
            ease: "power3.inOut",
          },
          "+=0.1",
        );
    }, loadingScreenRef);

    return () => ctx.revert();
  }, [isLoading]);

  useLayoutEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-logo", {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-title", {
        y: 45,
        opacity: 0,
        duration: 1.3,
        delay: 0.25,
        ease: "power3.out",
      });

      gsap.from(".hero-button", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "power2.out",
      });
    }, document.body);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div
          ref={loadingScreenRef}
          className="loading-screen"
          role="status"
          aria-label="Loading Flower World"
        >
          <span className="loading-screen__brand">bms.mec</span>
          <span className="loading-screen__track" aria-hidden="true">
            <span
              ref={loadingProgressRef}
              className="loading-screen__progress"
            />
          </span>
        </div>
      )}
      <main className="hero" id="home">
        <div className="scene">
          <video
            className="scene-video"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source
              src="/Firefly%20just%20open%20the%20eyes%20and%20make%20the%20leafs%20are%20slghtly%20moving%20by%20the%20wind%20361508.mp4"
              type="video/mp4"
            />
          </video>
          <div className="grain-overlay" aria-hidden="true" />
        </div>

        <section className="hero-content">
          <h1 className="hero-title">NATURE</h1>
          <div className="hero-caption">
            <span>BHOOMITHRASENA MEC</span>
            <span>TURNING AWARENESS INTO ACTION.</span>
          </div>
        </section>

        <a className="hero-button" href="#about">
          Explore our world <span>↗</span>
        </a>
      </main>
      <header className="navbar">
        <a className="hero-logo" href="#" aria-label="Flower World home">
          bms.mec
        </a>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
        <span className="brand-mark" aria-hidden="true">
          ✳
        </span>
      </header>
      <NavigationMenu
        open={menuOpen}
        onClose={closeMenu}
        triggerRef={menuButtonRef}
      />
      {/* <div className="bottom-note">
        <span>01 / 03</span>
      </div> */}
      <div className="content-world">
        <GridOverlay />
        <div className="content-sections">
          <About />
          <LeafTransition />
          <Initiatives />
          <EventsSection />
          <UpcomingSection />
          <BeliefSection />
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
