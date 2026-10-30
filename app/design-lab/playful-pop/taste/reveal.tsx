"use client";

import { useEffect } from "react";

/** Adds `shown` to each target once it scrolls into view. Without script, nothing is ever hidden. */
export function Reveal({ armed, shown, targets }: { armed: string; shown: string; targets: string[] }) {
    useEffect(() => {
        const root = document.querySelector<HTMLElement>("[data-pp-root]");
        if (!root || !("IntersectionObserver" in window)) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const els = root.querySelectorAll<HTMLElement>(targets.map((t) => `.${t}`).join(","));
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        e.target.classList.add(shown);
                        io.unobserve(e.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px" },
        );
        root.classList.add(armed);
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [armed, shown, targets]);
    return null;
}
