import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./LeafTransition.css";

gsap.registerPlugin(ScrollTrigger);

const leafImages = {
  red: "/leaf-transition/red.webp",
  g1: "/leaf-transition/g1.webp",
  g2: "/leaf-transition/g2.webp",
};

const leafSeeds = [
  { images: ["g2"], scaleRange: [0.2, 0.28], x: -42, start: 0, end: 5.5, sway: 2 },
  { images: ["red"], scaleRange: [0.3, 0.38], blurRange: [3, 5], x: -30, start: 0.5, end: 6, sway: 2 },
  { images: ["g1"], scaleRange: [0.18, 0.26], x: -18, start: 1, end: 6.5, sway: 2 },
  { images: ["red"], scaleRange: [0.1, 0.8], x: -7, start: 1.5, end: 7, sway: 2 },
  { images: ["g2"], scaleRange: [0.3, 0.38], blurRange: [3, 5], x: 0, start: 2, end: 7.5, sway: 2 },
  { images: ["g1"], scaleRange: [0.18, 0.8], x: 7, start: 2.5, end: 8, sway: 2 },
  { images: ["g2"], scaleRange: [0.2, 0.28], x: 18, start: 3, end: 8, sway: 2 },
  { images: ["red"], scaleRange: [0.3, 0.38], blurRange: [3, 5], x: 30, start: 3.5, end: 8.5, sway: 2 },
  { images: ["g1"], scaleRange: [0.18, 0.26], x: 42, start: 4, end: 9, sway: 2 },
];

function createLeafFrames(seed) {
  const random = gsap.utils.random;
  const scale = random(...seed.scaleRange);
  const blur = seed.blurRange ? random(...seed.blurRange) : 0;
  const end = seed.end ?? Math.min(10, seed.start + random(5, 6.5));
  const direction = random([-1, 1]);
  const sway = seed.sway ?? 6;
  const frames = [
    [
      0,
      seed.x,
      135,
      random(-30, 30),
      random(-40, 40),
      random(-30, 30),
      random(0.9, 1.1),
    ],
  ];

  if (seed.start > 0) frames.push([seed.start, ...frames[0].slice(1)]);
  const baseRotation = frames[0][3];

  for (let step = 1; step <= 3; step += 1) {
    const progress = step / 3;
    frames.push([
      seed.start + (end - seed.start) * progress,
      seed.x + (step % 2 ? 1 : -1) * direction * random(sway * 0.4, sway),
      135 - 270 * progress,
      baseRotation + direction * 90 * step * random(0.6, 1.2),
      random(-60, 60),
      random(-45, 45),
      random(0.9, 1.15),
    ]);
  }

  return { scale, blur, frames };
}

export default function LeafTransition() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const context = gsap.context(() => {
      const leafElements = gsap.utils.toArray(
        ".leaf-transition__leaf",
        section
      );
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top -100%",
          scrub: 3,
        },
      });

      leafElements.forEach((element, index) => {
        const seed = leafSeeds[index];
        const { scale, blur, frames } = createLeafFrames(seed);
        const tilt = element.querySelector(".leaf-transition__tilt");
        const [, x, y, rotation, rotationX, rotationY, initialScale] = frames[0];

        element.style.setProperty("--leaf-scale", scale);
        element.style.filter = blur ? `blur(${blur}px)` : "none";
        gsap.set(element, {
          xPercent: -50,
          yPercent: -50,
          x: `${x}vw`,
          y: `${y}vh`,
          rotation,
          rotationX,
          rotationY,
          scale: initialScale,
          transformPerspective: 900,
        });

        for (let frameIndex = 1; frameIndex < frames.length; frameIndex += 1) {
          const [previousTime] = frames[frameIndex - 1];
          const [time, frameX, frameY, frameRotation, frameRotationX, frameRotationY, frameScale] =
            frames[frameIndex];

          timeline.to(
            element,
            {
              x: `${frameX}vw`,
              y: `${frameY}vh`,
              rotation: frameRotation,
              rotationX: frameRotationX,
              rotationY: frameRotationY,
              scale: frameScale,
              duration: time - previousTime,
              ease: "sine.inOut",
            },
            previousTime
          );
        }

        if (seed.images.length > 1) {
          timeline.to(
            tilt.children[1],
            { opacity: 1, duration: 2.6, ease: "sine.inOut" },
            4.2
          );
        }

        if (!reduceMotion) {
          gsap.to(tilt, {
            y: gsap.utils.random(10, 22),
            rotation: gsap.utils.random(-7, 7),
            duration: gsap.utils.random(2.4, 4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.3,
          });
          gsap.to(tilt, {
            rotationY: gsap.utils.random(-18, 18),
            duration: gsap.utils.random(3, 5),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }

        gsap.from(element, {
          opacity: 0,
          duration: 1.4,
          delay: 0.15 + index * 0.12,
          ease: "power2.out",
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      className="leaf-transition"
      ref={sectionRef}
      aria-hidden="true"
    >
      <div className="leaf-transition__layer">
        {leafSeeds.map((seed, index) => (
          <div
            className="leaf-transition__leaf"
            key={`leaf-${index}`}
            style={{ zIndex: seed.z }}
          >
            <div className="leaf-transition__tilt">
              {seed.images.map((image, imageIndex) => (
                <img
                  key={`${image}-${imageIndex}`}
                  src={leafImages[image]}
                  alt=""
                  decoding="async"
                  style={{ opacity: imageIndex === 0 ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
