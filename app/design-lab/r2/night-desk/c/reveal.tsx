"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

type Props = {
    as?: "ol" | "div" | "section";
    className?: string;
    /** Class added once the element is in view. */
    inClassName: string;
    threshold?: number;
    style?: CSSProperties;
    children?: ReactNode;
    "aria-hidden"?: boolean;
    "aria-labelledby"?: string;
};

/**
 * Marks its element `data-ready` on mount and adds `inClassName` the first time it scrolls into view.
 * The CSS only hides the "before" state when scripting is enabled, motion is allowed and `data-ready` is
 * present (with a timed fallback), so the content is complete without JS.
 */
export function Reveal({ as = "div", className, inClassName, threshold = 0.35, children, ...rest }: Props) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.dataset.ready = "";
        if (typeof IntersectionObserver === "undefined") {
            el.classList.add(inClassName);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    el.classList.add(inClassName);
                    io.disconnect();
                }
            },
            { threshold },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [inClassName, threshold]);

    if (as === "ol") {
        return (
            <ol ref={ref as RefObject<HTMLOListElement>} className={className} {...rest}>
                {children}
            </ol>
        );
    }
    if (as === "section") {
        return (
            <section ref={ref} className={className} {...rest}>
                {children}
            </section>
        );
    }
    return (
        <div ref={ref as RefObject<HTMLDivElement>} className={className} {...rest}>
            {children}
        </div>
    );
}
