import React from "react";
import "./FeatureSections.css";

export default function BeliefSection() {
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

        {/* Main headline */}
        <div className="belief-heading">
          <h2 className="belief-title" id="belief-title">
            <span>A BETTER PLANET</span>
            <span>BEGINS WITH US.</span>
          </h2>
        </div>

        {/* Optional visual area */}
        <div
          className="belief-visual"
          aria-label="Reserved space for a nature image"
        >
          <span className="visual-index">02 / OUR PURPOSE</span>
          <span className="visual-placeholder-label">
            IMAGE AREA
          </span>
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