/* site.js — site-wide JavaScript for laurence-dawes.design.
   Two independent behaviors, each in its own IIFE:
     1. Reveal-on-scroll for h1s and blue buttons (fade-up).
     2. Smooth scroll-to-top for pink buttons.
   Plain vanilla JS, no dependencies. Loaded via Super's site-wide code
   injection with `defer`. */

/* =========================================================================
   1. Reveal-on-scroll
   IntersectionObserver fades target elements up into place when they
   enter the viewport. Targets: every h1, and every .notion-button that
   contains a .bg-blue-light child (the blue button treatment).

   Each target is set hidden inline at registration time (opacity 0 +
   translateY). If site.js fails to load entirely, the elements stay un-
   hidden and just render — safe failure mode.

   After each reveal finishes, animation.commitStyles() bakes the end
   state into inline style and animation.cancel() removes the WAAPI
   animation. This is important: it lets the session #6 CSS :hover rules
   on buttons apply cleanly afterwards (a WAAPI animation in fill:forwards
   state would otherwise shadow them).

   prefers-reduced-motion: reduce — early-return, leave targets visible
   with no observer attached.

   Super does client-side navigation (content swaps without a full reload),
   so a MutationObserver re-scans the DOM as it changes, plus a couple of
   timed retries cover late-rendered nodes. Registration is guarded by a
   data-attribute so the same element never animates twice.
   ========================================================================= */

(function () {
  "use strict";

  // === Reveal tuning ===
  const REVEAL_DURATION_MS = 1000;
  const REVEAL_EASING      = "cubic-bezier(0.22, 1, 0.36, 1)";
  const REVEAL_DISTANCE_PX = 28;
  const STAGGER_H1_MS      = 100;   // delay between successive h1s revealing together
  const STAGGER_BUTTON_MS  = 120;   // delay between successive blue buttons revealing together

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const REGISTERED_ATTR = "data-reveal-registered";

  const setHidden = (el) => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(" + REVEAL_DISTANCE_PX + "px)";
    el.style.willChange = "opacity, transform";
  };

  const animateIn = (el, delayMs) => {
    const anim = el.animate(
      [
        { opacity: 0, transform: "translateY(" + REVEAL_DISTANCE_PX + "px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: REVEAL_DURATION_MS,
        easing:   REVEAL_EASING,
        delay:    delayMs,
        fill:     "forwards"
      }
    );
    anim.addEventListener("finish", () => {
      // Bake end state into inline style, then drop the WAAPI animation so
      // CSS :hover rules from session #6 aren't shadowed by fill:forwards.
      try { anim.commitStyles(); } catch (_) { /* commitStyles can throw on disconnected nodes; harmless */ }
      anim.cancel();
      el.style.willChange = "";
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
    threshold:  0.05,
    rootMargin: "0px 0px -40px 0px"
  });

  const register = (el) => {
    if (el.getAttribute(REGISTERED_ATTR)) return;
    el.setAttribute(REGISTERED_ATTR, "true");
    setHidden(el);
    observer.observe(el);
  };

  const scan = () => {
    document.querySelectorAll("h1").forEach(register);
    document.querySelectorAll(".notion-button:has(.bg-blue-light)").forEach(register);
  };

  // Initial pass — run immediately if DOM is parsed, otherwise wait. Plus a
  // pair of timed retries for any content Super hydrates after first paint.
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

  // SPA-safe: rescan when the DOM mutates, throttled to once per frame.
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

  const SCROLL_DURATION_MS = 1900;
  const BOUND_ATTR = "data-scroll-top-bound";

  const easeInOutQuart = (t) =>
    t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2;

  const smoothScrollToTop = () => {
    const startY = window.scrollY;
    if (startY === 0) return;

    // Direct scrollTop assignment instead of window.scrollTo(). The
    // scrollTop setter is always instant by spec — CSS scroll-behavior
    // does not apply to direct property writes, so each rAF tick lands
    // exactly where we tell it. window.scrollTo() in Safari still got
    // re-smoothed even after we toggled html.style.scrollBehavior; this
    // path sidesteps the issue entirely.
    const scrollEl = document.scrollingElement || document.documentElement;
    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
      scrollEl.scrollTop = startY * (1 - easeInOutQuart(t));
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
