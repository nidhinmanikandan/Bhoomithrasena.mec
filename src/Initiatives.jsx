import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Initiatives.css";
import InitiativesTrack from "./InitiativesTrack";

gsap.registerPlugin(ScrollTrigger);

export default function Initiatives() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const aboutSection = document.getElementById("about");
    const contentWorld = sectionRef.current?.closest(".content-world");

    if (!aboutSection || !contentWorld || !sectionRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to([aboutSection, contentWorld], {
        backgroundColor: "#121417",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <>
      <section className="initiatives-intro" id="initiatives" ref={sectionRef}>
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
      </section>
      <InitiativesTrack />
    </>
  );
}
