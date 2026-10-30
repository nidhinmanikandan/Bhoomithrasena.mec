
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./InitiativesTrack.css";

gsap.registerPlugin(ScrollTrigger);

const initiatives = [
  {
    number: "01",
    title: "E-WASTE COLLECTION",
    titleClass: "initiative-title--ewaste",
    subtitle: "RESPONSIBLE DISPOSAL",
    description:
      "Giving discarded electronics a better future through responsible collection, recycling, and environmental awareness.",
    image: "/initiatives/ewaste.jpg",
  },
  {
    number: "02",
    title: "HACKEARTH",
    titleClass: "initiative-title--hackearth",
    subtitle: "TECH FOR THE PLANET",
    description:
      "Bringing students, creativity, and technology together to explore innovative solutions to environmental challenges.",
    image: "/initiatives/hackearth.jpg",
  },
  {
    number: "03",
    title: "THE PEN BOX INITIATIVE",
    titleClass: "initiative-title--penbox",
    subtitle: "SMALL THINGS MATTER",
    description:
      "Collecting used pens and encouraging responsible disposal to reduce everyday plastic waste.",
    image: "/initiatives/pen-box.jpg",
  },
  
  {
    number: "05",
    title: "NATURE VISITS",
    titleClass: "initiative-title--visits",
    subtitle: "STEP INTO THE WILD",
    description:
      "Taking learning beyond the classroom and helping students build a deeper connection with the natural world.",
    image: "/initiatives/nature-visits.jpg",
  },

  {
    number: "04",
    title: "PLANT A TREE FOR EACH EVENT",
    titleClass: "initiative-title--tree",
    subtitle: "LET EVERY EVENT GROW",
    description:
      "Turning campus events into opportunities to nurture greener spaces, one sapling at a time.",
    image: "/initiatives/tree-planting.jpg",
  },
];

export default function InitiativesTrack() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const aboutSection = document.getElementById("about");
    const contentWorld = section.closest(".content-world");

    const ctx = gsap.context(() => {
      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (aboutSection && contentWorld) {
        gsap.to([aboutSection, section, contentWorld], {
          backgroundColor: "#121417",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      }
    }, section);

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);
    const images = track.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", refresh);
        img.addEventListener("error", refresh);
      }
    });

    return () => {
      window.removeEventListener("load", refresh);
      images.forEach((img) => {
        img.removeEventListener("load", refresh);
        img.removeEventListener("error", refresh);
      });
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="initiatives-track-section"
      id="initiatives"
      ref={sectionRef}
      aria-label="Our environmental initiatives"
    >
      <div className="initiatives-track" ref={trackRef}>
        <div className="initiatives-intro">
          <div className="initiatives-heading">
            <span className="initiatives-eyebrow">02 / WHAT WE DO</span>

            <h2>INITIATIVES</h2>

            <p>
              Small actions. Meaningful change.
              <br />
              Explore how we make a difference.
            </p>
          </div>

          <span className="initiatives-index">
            SCROLL TO EXPLORE<span>→</span>
          </span>
        </div>

        {initiatives.map((item) => (
          <article className="initiative-panel" key={item.number}>
            <div className="initiative-copy">
              <div className="initiative-heading">
                <span className="initiative-number">
                  {item.number} / 05
                </span>

                {/* <span className="initiative-subtitle">
                  {item.subtitle}
                </span> */}

                <h3 className={`initiative-title ${item.titleClass}`}>
                  {item.title}
                </h3>
              </div>

              <div className="initiative-description">
                <p>{item.description}</p>

                {/* <span className="initiative-bottom-label">
                  BHOOMITHRASENA MEC
                </span> */}
              </div>
            </div>

            <div
              className={`initiative-visual${
                item.titleClass === "initiative-title--ewaste"
                  ? " initiative-visual--ewaste"
                  : ""
              }${
                item.titleClass === "initiative-title--hackearth"
                  ? " initiative-visual--hackearth"
                  : ""
              }${
                item.titleClass === "initiative-title--penbox"
                  ? " initiative-visual--penbox"
                  : ""
              }`}
            >
              {item.titleClass !== "initiative-title--ewaste" &&
                item.titleClass !== "initiative-title--hackearth" &&
                item.titleClass !== "initiative-title--penbox" && (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="eager"
                  />
                )}
              {item.titleClass === "initiative-title--ewaste" && (
                <img
                  className="initiative-recycle-logo"
                  src="/recycle-logo.png"
                  alt="Recycle"
                  loading="eager"
                />
              )}
              {item.titleClass === "initiative-title--hackearth" && (
                <img
                  className="initiative-man-flying"
                  src="/man-flying.png"
                  alt="Person flying through nature"
                  loading="eager"
                />
              )}
              {item.titleClass === "initiative-title--penbox" && (
                <img
                  className="initiative-penbox-grass"
                  src="/penbox-grass.png"
                  alt="Grass formed into a pen box"
                  loading="eager"
                />
              )}
            </div>

            {/* <span className="initiative-panel-counter">
              {item.number} — 05
            </span> */}
          </article>
        ))}
      </div>
    </section>
  );
}
