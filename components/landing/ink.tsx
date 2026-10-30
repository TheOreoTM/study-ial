// Hand-drawn pen marks for the landing page. Paths are deliberately a little wobbly.
// `delay` staggers the draw-on animation (see .ink-draw in globals.css).
import { cn } from "@/lib/utils";

type InkProps = { className?: string; delay?: number };

function Svg({ viewBox, className, delay = 0, children }: InkProps & { viewBox: string; children: React.ReactNode }) {
    return (
        <svg
            viewBox={viewBox}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={cn("overflow-visible text-pen", className)}
            style={{ ["--ink-delay" as string]: `${delay}s` }}
        >
            {children}
        </svg>
    );
}

export function InkTick({ className, delay }: InkProps) {
    return (
        <Svg viewBox="0 0 24 24" className={className} delay={delay}>
            <path
                className="ink-draw"
                pathLength={1}
                strokeWidth={2.4}
                d="M3.5 13.2c1.6 1.2 3.3 3 4.6 5.1C11 12.4 15.4 7.1 20.8 3.6"
            />
        </Svg>
    );
}

/** A loose oval drawn around something, overshooting where the pen started. */
export function InkCircle({ className, delay }: InkProps) {
    return (
        <Svg viewBox="0 0 200 60" className={className} delay={delay}>
            <path
                className="ink-draw"
                pathLength={1}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                d="M28 9C72 1 160 2 189 18c14 9 2 27-41 34-49 8-120 6-140-9C-8 32 9 15 46 8c20-4 49-5 64-4"
            />
        </Svg>
    );
}

export function InkUnderline({ className, delay, double }: InkProps & { double?: boolean }) {
    return (
        <Svg viewBox="0 0 120 14" className={className} delay={delay}>
            <path
                className="ink-draw"
                pathLength={1}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                d="M2 5c30-2.5 74-3.5 116-1"
            />
            {double && (
                <path
                    className="ink-draw"
                    pathLength={1}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    style={{ animationDelay: `calc(var(--ink-delay) + 0.25s)` }}
                    d="M10 11.5c26-2 62-2.6 100-.6"
                />
            )}
        </Svg>
    );
}

/** A curved arrow drawn up and to the right, for margin notes that point back at something above. */
export function InkArrow({ className, delay }: InkProps) {
    return (
        <Svg viewBox="0 0 40 72" className={className} delay={delay}>
            <path className="ink-draw" pathLength={1} strokeWidth={2} d="M4 70C9 47 19 22 37 7" />
            <path
                className="ink-draw"
                pathLength={1}
                strokeWidth={2}
                style={{ animationDelay: "calc(var(--ink-delay) + 0.45s)" }}
                d="M26.5 6.2 37.6 6.3 35.2 17"
            />
        </Svg>
    );
}

/** A faint coffee-ring stain: a darker, uneven rim where the coffee dried, with a barely tinted middle. */
export function CoffeeRing({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 120 120" aria-hidden className={cn("pointer-events-none mix-blend-multiply", className)}>
            <path
                fill="none"
                stroke="rgb(150 95 45 / 0.28)"
                strokeWidth="2.6"
                strokeLinecap="round"
                d="M60 15c25-1 46 19 46 45 0 25-20 46-46 46-25 0-46-20-46-45 0-14 6-27 16-35"
            />
            <path
                fill="none"
                stroke="rgb(150 95 45 / 0.16)"
                strokeWidth="5"
                strokeLinecap="round"
                d="M88 26c11 8 18 21 18 35"
            />
            <path
                fill="none"
                stroke="rgb(150 95 45 / 0.12)"
                strokeWidth="1.2"
                strokeLinecap="round"
                d="M24 37c7-12 20-20 35-21"
            />
        </svg>
    );
}
