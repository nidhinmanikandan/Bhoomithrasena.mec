import React from "react";
import "./FeatureSections.css";

const HACKEARTH = {
  title: "HACKEARTH",
  subtitle: "Code with nature in mind.",
  date: "10—11 JANUARY 2026",
  prize: "₹4,000",
  status: "PAST EVENT",
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
          <span>— WHAT'S NEXT?</span>
        </div>

        {/* Main editorial heading */}
        <div className="hackearth-heading">
          <p className="feature-kicker">BHOOMITHRASENA MEC × IDEALab</p>

          <h2
            className="hackearth-title initiative-title--tree"
            id="hackearth-title"
          >
            {HACKEARTH.title}
          </h2>

          <p className="hackearth-subtitle">
            {HACKEARTH.subtitle}
          </p>
        </div>

        {/* Empty image area: insert an actual poster or photo later */}
        <div
          className="hackearth-visual"
          aria-label="Reserved space for the HackEarth event visual"
        >
          <span className="visual-index">01 / EVENT VISUAL</span>
          <span className="visual-placeholder-label">
            IMAGE AREA
          </span>
          <span className="visual-caption">
            CODE. BUILD. SUSTAIN.
          </span>
        </div>

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

          <p className="feature-body">
            Participants from other colleges are also encouraged.
          </p>
        </div>

        {/* Details aligned to the grid */}
        <div className="hackearth-meta">
          <div className="event-meta-item">
            <span className="event-meta-label">DATE</span>
            <span className="event-meta-value">{HACKEARTH.date}</span>
          </div>

          <div className="event-meta-item">
            <span className="event-meta-label">PRIZE POOL</span>
            <span className="event-meta-value">{HACKEARTH.prize}</span>
          </div>

          <div className="event-meta-item">
            <span className="event-meta-label">STATUS</span>
            <span className="event-meta-value">{HACKEARTH.status}</span>
          </div>

          <a
            className="feature-link hackearth-link"
            href={HACKEARTH.registrationUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the original HackEarth event link"
          >
            VIEW EVENT LINK <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Footer note */}
        <div className="hackearth-footer">
          <span>INNOVATION WITH PURPOSE</span>
          <span>ENVIRONMENT × TECHNOLOGY</span>
        </div>
      </div>
    </section>
  );
}