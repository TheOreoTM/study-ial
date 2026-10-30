"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Decorative wrapper (aria-hidden). Arms its children's fill animation only when it starts below the fold, then plays it once on scroll-in.
 * Server HTML (and no-JS, and reduced motion) always shows the finished state.
 */
export function FillOnView({ className, children }: { className?: string; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

        el.dataset.fill = "armed";
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    el.dataset.fill = "in";
                    io.disconnect();
                }
            },
            { threshold: 0.45 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={ref} className={className} aria-hidden="true">
            {children}
        </div>
    );
}
