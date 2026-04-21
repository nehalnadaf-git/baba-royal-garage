"use client";

import { useEffect } from "react";

const SELECTORS = [
  ".section-fade-in",
  ".reveal",
  ".reveal-left",
  ".reveal-right",
  ".reveal-scale",
  ".stagger-children",
].join(", ");

function observeAll(observer: IntersectionObserver) {
  document.querySelectorAll(SELECTORS).forEach((el) => {
    if (!el.classList.contains("visible")) {
      observer.observe(el);
    }
  });
}

function forceRevealAll() {
  document.querySelectorAll(SELECTORS).forEach((el) => {
    el.classList.add("visible");
  });
}

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // threshold:0 fires as soon as even 1px enters the viewport — safest
        // for mobile where partial visibility can fail the 10% check.
        threshold: 0,
        // Keep a small negative bottom margin so cards "pop" just before
        // they hit the very bottom edge; avoid large negative values that
        // can shift the trigger zone completely off-screen on small devices.
        rootMargin: "0px 0px -20px 0px",
      }
    );

    // Observe elements already in the DOM on mount
    observeAll(observer);

    // Safety fallback: if any animated element is still invisible after
    // 1200 ms (e.g. the IO silently failed on a low-end mobile browser),
    // force all of them visible so the user never sees a blank page.
    const fallbackTimer = setTimeout(forceRevealAll, 1200);

    // Re-observe whenever new elements are added (SPA route changes)
    const mutationObserver = new MutationObserver(() => {
      observeAll(observer);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
