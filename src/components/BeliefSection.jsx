import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FeatureSections.css";

gsap.registerPlugin(ScrollTrigger);

export default function BeliefSection() {
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = gsap.utils.toArray(".belief-title > span", title);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          end: "bottom 35%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      lines.forEach((line, index) => {
        const progress = index / Math.max(lines.length - 1, 1);
        const duration = gsap.utils.interpolate(1, 0.25, progress);

        timeline.fromTo(
          line,
          { x: () => -window.innerWidth * 0.5 },
          { x: 0, duration, ease: "none" },
          1 - duration
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      className="feature-section belief-section"
      id="belief"
      aria-labelledby="belief-title"
    >
      <div className="feature-grid">
        {/* Section label */}
        <div className="feature-eyebrow belief-eyebrow">
          <span>07</span>
          <span>— BELIEF</span>
        </div>

        <div className="belief-sticky-stage">
          <img
            className="belief-visual"
            src="/running-grass.png"
            alt="A figure made of grass and flowers"
            loading="lazy"
          />

          <div className="belief-sticky-texts">
            <p className="belief-label">Our Belief</p>
            <p className="belief-why">WHY</p>
          </div>
        </div>

        {/* Supporting copy */}
        <div className="belief-copy">
          <p className="belief-intro">
            We believe that protecting nature begins with understanding
            it, and meaningful change begins with the choices we make
            every day.
          </p>

          <p className="feature-body">
            Through curiosity, collective action, and a deeper connection
            with the environment, we strive to turn awareness into action
            — one idea, one initiative, and one small step at a time.
          </p>

          <p className="belief-closing">
            A greener future isn't built by one person doing everything.
            It's built by all of us doing something.
          </p>
        </div>

        {/* Main headline */}
        <div className="belief-heading">
          <h2 className="belief-title" id="belief-title" ref={titleRef}>
            <span>A BETTER</span>
            <span>PLANET</span>
            <span className="begins001">BEGINS</span>
            <span className="begins001">WITH US.</span>
          </h2>
        </div>

        {/* Closing line */}
        <div className="belief-footer">
          <span>
            BHOOMITHRASENA MEC
          </span>
          <span>
            GROWING AWARENESS. INSPIRING ACTION.
          </span>
        </div>
      </div>
    </section>
  );
}