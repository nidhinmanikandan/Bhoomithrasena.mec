import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./NavigationMenu.css";

const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Initiatives", href: "#initiatives" },
  { label: "Events", href: "#more-events" },
  { label: "Upcoming", href: "#upcoming" },
  { label: "Belief", href: "#belief" },
  { label: "Contact", href: "#contact" },
];

export default function NavigationMenu({ open, onClose, triggerRef }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closeMenuRef = useRef(null);
  const openTimelineRef = useRef(null);

  const handleKeyDown = (event) => {
    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenuRef.current?.();
      return;
    }

    if (event.key !== "Tab") return;
    const overlay = overlayRef.current;
    const focusable = overlay?.querySelectorAll(
      'button:not([disabled]), a[href]'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !open) return undefined;

    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let closing = false;

    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const finishClose = (href) => {
      let target;
      if (href) {
        window.history.pushState(null, "", href);
        target = document.getElementById(decodeURIComponent(href.slice(1)));
      }

      onClose();
      triggerRef.current?.focus();
      if (target) {
        window.setTimeout(() => {
          target.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }, 0);
      }
    };

    closeMenuRef.current = (href) => {
      if (closing) return;
      closing = true;
      openTimelineRef.current?.kill();
      openTimelineRef.current = null;
      gsap.killTweensOf(overlay);

      const finish = () => {
        gsap.set(overlay, { visibility: "hidden" });
        finishClose(href);
      };

      if (reducedMotion) {
        gsap.set(overlay, { clipPath: "inset(0 0 100% 0)" });
        finish();
      } else {
        gsap.to(overlay, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.65,
          ease: "power3.inOut",
          onComplete: finish,
        });
      }
    };

    const context = gsap.context(() => {
      gsap.set(overlay, {
        visibility: "visible",
        clipPath: "inset(0 0 100% 0)",
      });

      const timeline = gsap.timeline({
        onComplete: () => closeButtonRef.current?.focus(),
      });
      openTimelineRef.current = timeline;
      closeButtonRef.current?.focus();

      timeline.to(overlay, {
        clipPath: "inset(0 0 0% 0)",
        duration: reducedMotion ? 0 : 0.8,
        ease: "power3.inOut",
      });

      timeline.fromTo(
        ".navigation-menu__link",
        {
          y: reducedMotion ? 0 : 24,
          autoAlpha: reducedMotion ? 1 : 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: reducedMotion ? 0 : 0.48,
          stagger: reducedMotion ? 0 : 0.065,
          ease: "power2.out",
        },
        reducedMotion ? 0 : "-=0.36"
      );

      timeline.fromTo(
        ".navigation-menu__line",
        { scaleX: reducedMotion ? 1 : 0 },
        {
          scaleX: 1,
          duration: reducedMotion ? 0 : 0.42,
          stagger: reducedMotion ? 0 : 0.055,
          ease: "power2.out",
        },
        reducedMotion ? 0 : "-=0.35"
      );
    }, overlay);

    return () => {
      closeMenuRef.current = null;
      openTimelineRef.current?.kill();
      openTimelineRef.current = null;
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      context.revert();
    };
  }, [open, onClose, triggerRef]);

  const handleNavigation = (event, href) => {
    event.preventDefault();
    closeMenuRef.current?.(href);
  };

  return (
    <div
      ref={overlayRef}
      className="navigation-menu"
      id="site-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      inert={!open}
      onKeyDown={handleKeyDown}
    >
      <div className="navigation-menu__layout">
        <div className="navigation-menu__top">
          <span className="navigation-menu__label">BHOOMITHRASENA MEC</span>
          <button
            ref={closeButtonRef}
            className="navigation-menu__close"
            type="button"
            onClick={() => closeMenuRef.current?.()}
            aria-label="Close navigation menu"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="navigation-menu__nav" aria-label="Main navigation">
          {navigationItems.map(({ label, href }) => (
            <a
              className="navigation-menu__link"
              href={href}
              key={href}
              onClick={(event) => handleNavigation(event, href)}
            >
              <span>{label}</span>
              <span className="navigation-menu__line" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
