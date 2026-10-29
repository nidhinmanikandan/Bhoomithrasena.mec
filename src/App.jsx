import { useLayoutEffect } from "react";
import gsap from "gsap";
import About from "./About";
import GridOverlay from "./GridOverlay";
import Initiatives from "./Initiatives";

export default function App() {
  useLayoutEffect(() => {
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
  }, []);

  

  return (
    <>
    
      <main className="hero">
        <div className="scene">
          <video className="scene-video" autoPlay loop muted playsInline aria-hidden="true">
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
        <button className="menu-button">Menu</button>
        <span className="brand-mark" aria-hidden="true">
          ✳
        </span>
      </header>
      <div className="bottom-note">
        <span>01 / 03</span>
      </div>
      <div className="content-world">
        <GridOverlay />
        <div className="content-sections">
          <About />
          <Initiatives />
        </div>
      </div>
      
    </>
  );
}
