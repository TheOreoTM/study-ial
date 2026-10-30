"use client";

import { useEffect } from "react";

/** Section entrances: arms [data-reveal] only once script runs, so content never hides without it. */
export function Reveal() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
        const groups = new Map<Element, number>();
        for (const el of els) {
            const section = el.closest("section, footer") ?? document.body;
            const n = groups.get(section) ?? 0;
            groups.set(section, n + 1);
            el.style.setProperty("--stagger", `${n * 80}ms`);
            if (el.getBoundingClientRect().top > window.innerHeight * 0.92) el.dataset.reveal = "armed";
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    (entry.target as HTMLElement).dataset.reveal = "in";
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -8% 0px" },
        );
        for (const el of els) if (el.dataset.reveal === "armed") io.observe(el);
        const hero = els.filter((el) => el.dataset.reveal !== "armed");
        for (const el of hero) el.dataset.reveal = "load";
        return () => io.disconnect();
    }, []);
    return null;
}
