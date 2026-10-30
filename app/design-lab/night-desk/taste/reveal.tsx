"use client";

import { useEffect } from "react";

// Section entrances: marks the root as animated, then reveals each [data-rise] element once as it enters.
// Without script nothing is hidden: the hiding CSS only applies under [data-anim="on"].
export function Reveal({ rootId }: { rootId: string }) {
    useEffect(() => {
        const root = document.getElementById(rootId);
        if (!root) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const items = Array.from(root.querySelectorAll<HTMLElement>("[data-rise]"));
        const vh = window.innerHeight;
        // Things already on the first screen arrive as a short load sequence.
        for (const el of items) if (el.getBoundingClientRect().top > vh * 0.92) el.dataset.wait = "";
        root.dataset.anim = "on";
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue;
                    const el = e.target as HTMLElement;
                    delete el.dataset.wait;
                    el.dataset.in = "";
                    io.unobserve(el);
                }
            },
            { rootMargin: "0px 0px -8% 0px" },
        );
        requestAnimationFrame(() => {
            for (const el of items) {
                if (el.dataset.wait === undefined) el.dataset.in = "";
                else io.observe(el);
            }
        });
        return () => io.disconnect();
    }, [rootId]);
    return null;
}
