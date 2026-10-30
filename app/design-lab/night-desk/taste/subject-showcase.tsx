"use client";

import { useEffect, useRef, useState } from "react";
import s from "./night-desk.module.css";

type Subject = { name: string; units: number; href: string };

const pictures: Record<string, { src: string; alt: string; tone: string }> = {
    Physics: { src: "/design-lab/night-desk-taste/physics.jpg", alt: "A Newton's cradle mid-swing", tone: "honey" },
    Chemistry: {
        src: "/design-lab/night-desk-taste/chemistry.jpg",
        alt: "An 18th-century engraving of a chemical laboratory full of glass vessels",
        tone: "copper",
    },
    Biology: {
        src: "/design-lab/night-desk-taste/biology.jpg",
        alt: "Robert Hooke's 1665 engraving of a flea seen through a microscope",
        tone: "cocoa",
    },
    Mathematics: {
        src: "/design-lab/night-desk-taste/mathematics.jpg",
        alt: "A 15th-century engraving personifying Geometry with compasses",
        tone: "walnut",
    },
    "Further Mathematics": {
        src: "/design-lab/night-desk-taste/further-mathematics.jpg",
        alt: "A wooden slide rule",
        tone: "honey",
    },
};

// The live thing: point at (or focus) a subject and its picture slides into the lamp's circle.
// Untouched, the circle slowly crossfades through all five, pausing when the tab is hidden.
export function SubjectShowcase({ heading, items }: { heading: string; items: readonly Subject[] }) {
    const [active, setActive] = useState(0);
    const touched = useRef(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = window.setInterval(() => {
            if (touched.current || document.hidden) return;
            setActive((a) => (a + 1) % items.length);
        }, 5600);
        return () => window.clearInterval(id);
    }, [items.length]);

    const pick = (i: number) => {
        touched.current = true;
        setActive(i);
    };
    const current = items[active];
    const tone = pictures[current.name]?.tone ?? "honey";

    return (
        <div className={s.showcase}>
            <div className={s.showcaseStage} data-rise="2">
                <div className={s.showcaseDisc} data-tone={tone} />
                <div className={s.showcasePhoto}>
                    {items.map((it, i) => {
                        const p = pictures[it.name];
                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={it.name}
                                src={p.src}
                                alt={i === active ? p.alt : ""}
                                aria-hidden={i === active ? undefined : true}
                                width={1400}
                                height={1400}
                                loading="lazy"
                                data-on={i === active ? "" : undefined}
                            />
                        );
                    })}
                </div>
                <p className={s.showcaseFact} aria-live="polite">
                    <span className={s.showcaseFactNum}>{current.units}</span> units
                </p>
            </div>
            <div className={s.showcaseList} data-rise="1">
                <h2 className={s.showcaseHeading} id="subjects">
                    {heading}
                </h2>
                <ul>
                    {items.map((it, i) => (
                        <li key={it.name}>
                            <a
                                href={it.href}
                                data-on={i === active ? "" : undefined}
                                onMouseEnter={() => pick(i)}
                                onFocus={() => pick(i)}
                            >
                                {it.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
