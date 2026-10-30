
import "./EventsSection.css";

const events = [
  {
    number: "01",
    title: "ENVIHUNT 5.0",
    category: "CAMPUS · EXPLORATION",
    image: "/treasure-run.png",
    description:
      "Clues, teamwork, and a little adventure around campus.",
    className: "treasure",
  },
  {
    number: "02",
    title: "PHOTOGRAPHY",
    category: "CREATIVITY · NATURE",
    image: "/photography001.png",
    description:
      "Capturing the details of nature through a different lens.",
    className: "photography",
  },
  {
    number: "03",
    title: "BEACH CLEANUP",
    category: "COMMUNITY · NSS MEC",
    image: "/images/events/beach-cleanup.jpg",
    description:
      "Working together with NSS MEC for cleaner shores.",
    className: "beach",
  },
];

export default function EventsSection() {
  return (
    <section className="events-section" id="more-events">
      <div className="events-section__inner">
        <header className="events-section__header">
          <span className="events-section__eyebrow">
            05 — MORE THAN INITIATIVES
          </span>

          <h2 className="events-section__heading">
            MORE THAN
            <br />
            <span>INITIATIVES.</span>
          </h2>

          <p className="events-section__intro">
            From campus adventures to action beyond it,
            every event brings us closer together.
          </p>
        </header>

        <div className="events-grid">
          {events.map((event) => (
            <article
              className={`event-card event-card--${event.className}`}
              key={event.number}
            >
              <div className="event-card__visual">
                <img
                  className="event-card__image"
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                />

                <span className="event-card__number">
                  {event.number}
                </span>

                <span
                  className="event-card__arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

              <div className="event-card__content">
                <span className="event-card__category">
                  {event.category}
                </span>

                <h3 className="event-card__title">
                  {event.title}
                </h3>

                <p className="event-card__description">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* <footer className="events-section__footer">
          <span>SMALL EVENTS. LASTING IMPACT.</span>
          <span>BHOOMITHRASENA MEC · 05</span>
        </footer> */}
      </div>
    </section>
  );
}
