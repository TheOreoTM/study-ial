"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shows part of a page image (the real printed question) by positioning the full page inside a clipped box, so
 * regions can be adjusted without re-cropping. Page images come from the authenticated page route.
 */
export function RegionImage({
    src,
    bbox,
    alt,
    className,
}: {
    src: string;
    /** [x0, y0, x1, y1] fractions of the page */
    bbox: number[];
    alt: string;
    className?: string;
}) {
    // A4 until the image tells us its real shape (photos can be anything)
    const [ratio, setRatio] = useState(842 / 595);
    const [x0, y0, x1, y1] = bbox.length === 4 ? bbox : [0, 0, 1, 1];
    const w = Math.max(0.02, x1 - x0);
    const h = Math.max(0.01, y1 - y0);
    return (
        <div
            className={cn("relative w-full overflow-hidden rounded-md bg-white", className)}
            style={{ aspectRatio: `${w} / ${h * ratio}` }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-gated page image */}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth) setRatio(img.naturalHeight / img.naturalWidth);
                }}
                className="absolute max-w-none select-none"
                style={{ width: `${100 / w}%`, left: `${(-x0 / w) * 100}%`, top: `${(-y0 / h) * 100}%` }}
                draggable={false}
            />
        </div>
    );
}
