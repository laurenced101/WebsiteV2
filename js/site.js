/* site.js — site-wide JavaScript for laurence-dawes.design.
   Two independent behaviors, each in its own IIFE:
     1. Reveal-on-scroll for h1s and blue buttons (translate3d fade-up),
        plus a WAAPI hover (scale + opacity) on blue buttons.
     2. Smooth scroll-to-top for pink buttons.
   Plain vanilla JS, no dependencies. Loaded via Super's site-wide code
   injection with `defer`. */

/* =========================================================================
   1. Reveal + blue-button hover

   IntersectionObserver fades target elements up into place when they enter
   the viewport. Targets: every h1, and every .notion-button that contains
   a .bg-blue-light child (the blue button treatment).

   Both reveal and hover are WAAPI. Two reasons this matters:
     - Reveal uses translate3d (not translateY), which forces a GPU
       compositor layer. The hover scale then reuses the same layer.
       This is what prevents the Safari first-hover layout-shift bug.
     - Hover bypasses CSS entirely, so Super's global `transition: all`
       on .notion-button can't interfere — no transition handoff dance
       and no CSS workaround layer needed in base.css.

   Marker class .ln-blue-button is added at register so hover is decoupled
   from reveal completion (above-the-fold buttons get hover immediately).

   prefers-reduced-motion: reduce — early-return, leave targets visible
   with no observer attached and no hover.

   Super does client-side navigation, so a MutationObserver re-scans the
   DOM as it changes, plus two timed retries cover late-rendered nodes.
   Each element is guarded so it only registers once.
   ========================================================================= */

(function () {
  "use strict";

  // === Reveal tuning ===
  const REVEAL_DURATION_MS = 1000;
  const REVEAL_EASING      = "cubic-bezier(0.22, 1, 0.36, 1)";
  const REVEAL_DISTANCE_PX = 28;
  const STAGGER_H1_MS      = 100;
  const STAGGER_BUTTON_MS  = 120;

  // === Hover tuning (blue buttons only) ===
  const HOVER_SCALE        = 1.03;
  const HOVER_OPACITY      = 0.5;
  const HOVER_DURATION_MS  = 300;
  const HOVER_EASING       = "ease";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const REGISTERED_ATTR   = "data-reveal-registered";
  const BLUE_BUTTON_CLASS = "ln-blue-button";

  const setHidden = (el) => {
    el.style.opacity   = "0";
    el.style.transform = "translate3d(0, " + REVEAL_DISTANCE_PX + "px, 0)";
  };

  const animateIn = (el, delayMs) => {
    el.animate(
      [
        { opacity: 0, transform: "translate3d(0, " + REVEAL_DISTANCE_PX + "px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" }
      ],
      {
        duration: REVEAL_DURATION_MS,
        easing:   REVEAL_EASING,
        delay:    delayMs,
        fill:     "forwards"
      }
    );
  };

  // Always include translate3d alongside scale so the GPU layer stays
  // explicit across rest and hover states (belt-and-braces; once a layer
  // exists Safari tends to keep it, but pinning the transform keeps the
  // intent obvious).
  const attachHover = (el) => {
    el.addEventListener("mouseenter", () => {
      el.animate(
        [
          { transform: "translate3d(0, 0, 0) scale(1)",              opacity: 1 },
          { transform: "translate3d(0, 0, 0) scale(" + HOVER_SCALE + ")", opacity: HOVER_OPACITY }
        ],
        { duration: HOVER_DURATION_MS, easing: HOVER_EASING, fill: "forwards" }
      );
    });
    el.addEventListener("mouseleave", () => {
      el.animate(
        [
          { transform: "translate3d(0, 0, 0) scale(" + HOVER_SCALE + ")", opacity: HOVER_OPACITY },
          { transform: "translate3d(0, 0, 0) scale(1)",              opacity: 1 }
        ],
        { duration: HOVER_DURATION_MS, easing: HOVER_EASING, fill: "forwards" }
      );
    });
  };

  const observer = new IntersectionObserver((entries) => {
    // Stagger inside the batch — when multiple targets enter view in the
    // same frame, their reveals fan out in document order.
    const enteringH1s     = [];
    const enteringButtons = [];
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.tagName === "H1") enteringH1s.push(entry.target);
      else enteringButtons.push(entry.target);
    });
    enteringH1s.forEach((el, i) => {
      animateIn(el, i * STAGGER_H1_MS);
      observer.unobserve(el);
    });
    enteringButtons.forEach((el, i) => {
      animateIn(el, i * STAGGER_BUTTON_MS);
      observer.unobserve(el);
    });
  }, {
    threshold:  0.25,
    rootMargin: "0px 0px -40px 0px"
  });

  const registerReveal = (el) => {
    if (el.getAttribute(REGISTERED_ATTR)) return;
    el.setAttribute(REGISTERED_ATTR, "true");
    setHidden(el);
    observer.observe(el);
  };

  const registerBlueButton = (el) => {
    if (el.classList.contains(BLUE_BUTTON_CLASS)) return;
    el.classList.add(BLUE_BUTTON_CLASS);
    attachHover(el);
  };

  const scan = () => {
    document.querySelectorAll("h1").forEach(registerReveal);
    document.querySelectorAll(".notion-button:has(.bg-blue-light)").forEach((el) => {
      registerReveal(el);
      registerBlueButton(el);
    });
  };

  const onReady = () => {
    scan();
    setTimeout(scan, 200);
    setTimeout(scan, 800);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  let scanScheduled = false;
  const scheduleScan = () => {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      scan();
    });
  };
  new MutationObserver(scheduleScan).observe(document.body, {
    childList: true,
    subtree:   true
  });
})();

/* =========================================================================
   2. Smooth scroll-to-top
   Pink buttons (.notion-button__content.bg-pink-light) intercept their
   click and animate the page scroll from current Y to 0 over
   SCROLL_DURATION_MS using easeInOutQuart. Color-as-behavior: every pink
   button is a scroll-to-top trigger by design, consistent with the
   button color/style preset system from session #6.

   In Notion the button content is rendered as an <a>; the handler binds
   to that (or falls back to the .notion-button wrapper if Notion changes
   its markup later) so the whole hit area is captured.

   Same SPA concerns as Part 1 — MutationObserver + timed retries + a
   data-attribute bind-guard to prevent double-binding.
   ========================================================================= */

(function () {
  "use strict";

  const SCROLL_DURATION_MS = 1100;
  const BOUND_ATTR = "data-scroll-top-bound";

  // easeOutCubic — monotonic deceleration (fast start, gentle end).
  // Replaces easeInOutQuart, whose S-curve produced a perceived "snap" at
  // both ends because of the inflection in the middle.
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const smoothScrollToTop = () => {
    const startY = window.scrollY;
    if (startY === 0) return;
    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
      window.scrollTo(0, startY * (1 - easeOutCubic(t)));
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const bind = (el) => {
    if (el.getAttribute(BOUND_ATTR)) return;
    el.setAttribute(BOUND_ATTR, "true");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      smoothScrollToTop();
    });
  };

  const scan = () => {
    document.querySelectorAll(".notion-button__content.bg-pink-light").forEach((content) => {
      const target = content.closest("a") || content.closest(".notion-button") || content;
      bind(target);
    });
  };

  const onReady = () => {
    scan();
    setTimeout(scan, 200);
    setTimeout(scan, 800);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  let scanScheduled = false;
  const scheduleScan = () => {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      scan();
    });
  };
  new MutationObserver(scheduleScan).observe(document.body, {
    childList: true,
    subtree:   true
  });
})();
