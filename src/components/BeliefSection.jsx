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

    // ---- tuning ----
    const SIDE = -1;     // -1 = enter from the LEFT, 1 = enter from the RIGHT
    const SPREAD = 0.5;  // max horizontal distance (x viewport width)
    const CURVE = 1.9;   // higher = sharper bend near the bottom
    const SETTLE = 0.4;  // line is fully in place when its center reaches 40% from the top

    // smoothing (replaces scrub: 0.8)
    const setX = lines.map((l) => gsap.quickTo(l, "x", { duration: 0.6, ease: "power3.out" }));

    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      lines.forEach((line, i) => {
        const r = line.getBoundingClientRect(); // x transform doesn't change top, so no feedback loop
        const center = r.top + r.height / 2;
        // n: 1 when the line is at the bottom of the screen, 0 once it reaches SETTLE
        const n = gsap.utils.clamp(0, 1, (center - vh * SETTLE) / (vh * (1 - SETTLE)));
        setX[i](SIDE * vw * SPREAD * Math.pow(n, CURVE));
      });
    };

    ScrollTrigger.create({
      trigger: title,
      start: "top bottom",
      end: "bottom top",
      onUpdate: update,
      onRefresh: update,
    });

    update();

    return () => gsap.set(lines, { clearProps: "x" });
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

        {/* Main headline */}
        <div className="belief-heading">
          <h2 className="belief-title" id="belief-title" ref={titleRef}>
            <span>A BETTER</span>
            <span>PLANET</span>
            <span className="begins001">BEGINS</span>
            <span className="begins001">WITH US.</span>
          </h2>
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