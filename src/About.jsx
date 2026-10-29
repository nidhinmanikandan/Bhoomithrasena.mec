import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // Only animate when motion is allowed; otherwise everything stays visible.
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
          },
        });

        tl.from(".about__media", { y: 24, opacity: 0, duration: 1.2 }, 0)
          .from(".about__eyebrow", { y: 16, opacity: 0, duration: 0.9 }, 0.1)
          .from(
            ".about__line",
            { y: 24, opacity: 0, duration: 1.1, stagger: 0.14 },
            0.25
          )
          .from(
            ".about__para",
            {
              y: 20,
              opacity: 0,
              duration: 0.9,
              stagger: 0.18,
              ease: "power2.out",
            },
            "-=0.6"
          )
          .from(
            ".about__closing",
            { y: 15, opacity: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
          );
      },
      sectionRef // scopes ".about__*" selectors to this section
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="grain-overlay" aria-hidden="true" />

      <div className="about__inner">
        {/* Column 1 — image space.
            Put your <img src="..." alt="..." /> inside this figure. */}
        <figure className="about__media">
          {/* <img src="" alt="" /> */}
        </figure>

        {/* Columns 2–3 — text */}
        <div className="about__content">
          <p className="about__eyebrow">
            <i className="about__dot" aria-hidden="true" />
            WHO WE ARE
          </p>

          <h2 className="about__heading">
            <span className="about__line">Where awareness</span>{" "}
            <span className="about__line">takes root.</span>
          </h2>

          <div className="about__body">
            <p className="about__para about__lead">
              Bhoomithrasena MEC is the Nature Club of Government Model
              Engineering College, bringing students together to explore,
              understand, and protect the environment.
            </p>

            <p className="about__para about__text">
              Through hands-on activities, creative initiatives, and
              environmental awareness programmes, we encourage students to turn
              small actions into meaningful change. From responsible waste
              management to exploring the natural world, we believe every effort
              can contribute to a greener future.
            </p>
          </div>

          <p className="about__closing">GROWING A GREENER TOMORROW, TOGETHER.</p>
        </div>
      </div>
    </section>
  );
}