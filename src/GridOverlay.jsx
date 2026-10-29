import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GridOverlay.css";

gsap.registerPlugin(ScrollTrigger);

export default function GridOverlay() {
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    const hero = document.querySelector(".hero");

    if (!hero || !overlayRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to(overlayRef.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => context.revert();
  }, []);

  return (
    <div ref={overlayRef} className="grid-overlay" aria-hidden="true" />
  );
}