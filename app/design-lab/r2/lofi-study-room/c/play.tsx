"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Presses play on the deck the first time it is properly in view: the meters fill, the reels turn once and the
 * cued track lights. Without JS, or with reduced motion, nothing is hidden and nothing moves (see page.module.css).
 * The flag is a DOM attribute read only by CSS, so setting it directly avoids a re-render.
 */
export function PlayWhenSeen({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const play = () => el.setAttribute("data-play", "");
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
            play();
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    play();
                    io.disconnect();
                }
            },
            { threshold: 0.4 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
