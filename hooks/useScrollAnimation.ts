"use client";

import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    const selectors = [
      ".section-fade-in",
      ".reveal",
      ".reveal-left",
      ".reveal-right",
      ".reveal-scale",
      ".stagger-children",
    ].join(", ");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Unobserve after triggering for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    const elements = document.querySelectorAll(selectors);
    elements.forEach((el) => observer.observe(el));

    // Re-run on route change (observe newly added elements)
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll(selectors);
      newElements.forEach((el) => {
        if (!el.classList.contains("visible")) {
          observer.observe(el);
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
