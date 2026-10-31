import React from "react";
import "./FeatureSections.css";

const HACKEARTH = {
  title: "HACKEARTH",

  registrationUrl: "https://bit.ly/HackEarth",
};

export default function UpcomingSection() {
  return (
    <section
      className="feature-section hackearth-section"
      id="upcoming"
      aria-labelledby="hackearth-title"
    >
      <div className="feature-grid">
        {/* Section label */}
        <div className="feature-eyebrow hackearth-eyebrow">
          <span>06</span>
          <span>— UPCOMING EVENT...</span>
        </div>

        {/* Main editorial heading */}
        <div className="hackearth-heading">
          

          <h2
            className="hackearth-title initiative-title--tree"
            id="hackearth-title"
          >
            {HACKEARTH.title}
          </h2>
          <p className="feature-kicker">BHOOMITHRASENA MEC × IDEALab</p>

        </div>

        <div className="hackearth-visual">
          <img
            src="/computer-grass.jpg"
            alt="A computer surrounded by grass and flowers"
            loading="lazy"
          />
        </div>

        <p className="hackearth-sub-subtitle">
          Code with nature in mind.
        </p>

        {/* Event information */}
        <div className="hackearth-copy">
          <p className="feature-body">
            Bhoomithrasena MEC, in collaboration with Excel 2025 and
            IDEALab, presents HackEarth — a hands-on workshop and
            hackathon driven by innovation, sustainability, and
            real-world impact.
          </p>

          <p className="feature-body">
            Two days of Arduino-based hands-on sessions, brainstorming,
            bold problem-solving, and solutions that matter.
          </p>

          <a
            className="hackearth-register"
            href={HACKEARTH.registrationUrl}
            target="_blank"
            rel="noreferrer"
          >
            Register now <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Footer note */}
        {/* <div className="hackearth-footer">
          <span>INNOVATION WITH PURPOSE</span>
          <span>ENVIRONMENT × TECHNOLOGY</span>
        </div> */}
      </div>
    </section>
  );
}