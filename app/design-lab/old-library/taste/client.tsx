"use client";

import { useEffect, useState } from "react";

import s from "./old-library.module.css";

/* Signature move: the reading-room photographs crossfade slowly inside the hero arch. */
export function HeroRooms({ rooms }: { rooms: { src: string; alt: string }[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduce.matches) return;
        let timer: number | undefined;
        const start = () => {
            stop();
            timer = window.setInterval(() => setIndex((i) => (i + 1) % rooms.length), 5600);
        };
        const stop = () => {
            if (timer) window.clearInterval(timer);
            timer = undefined;
        };
        const onVisibility = () => (document.hidden ? stop() : start());
        start();
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [rooms.length]);

    return (
        <div className={s.heroArch}>
            {rooms.map((room, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={room.src}
                    src={room.src}
                    alt={i === index ? room.alt : ""}
                    aria-hidden={i === index ? undefined : true}
                    width={1600}
                    height={2133}
                    className={`${s.heroRoom} ${i === index ? s.heroRoomOn : ""}`}
                    fetchPriority={i === 0 ? "high" : "low"}
                />
            ))}
        </div>
    );
}

type Topic = { code: string; name: string; score: number; level: string; isNext?: boolean };

/* The live thing: pick a WPH11 topic and its arch fills with brass to the mastery score. */
export function MasteryArch({ topics, nextUp }: { topics: readonly Topic[]; nextUp: string }) {
    const initial = Math.max(
        0,
        topics.findIndex((t) => t.isNext),
    );
    const [active, setActive] = useState(initial);
    const topic = topics[active];

    return (
        <div className={s.masteryGrid}>
            <figure className={s.gaugePlate} aria-live="polite">
                <div className={s.gauge} role="img" aria-label={`${topic.code} ${topic.name}: ${topic.score}%`}>
                    <div className={s.gaugeFill} style={{ transform: `scaleY(${topic.score / 100})` }} />
                </div>
                <figcaption className={s.gaugeCaption}>
                    <span className={s.gaugeScore}>{topic.score}%</span>
                    <span className={s.gaugeName}>
                        {topic.code} {topic.name}
                    </span>
                    <span className={s.gaugeLevel}>{topic.level}</span>
                </figcaption>
            </figure>
            <div className={s.topicSide}>
                <ul className={s.topicList} data-reveal>
                    {topics.map((t, i) => (
                        <li key={t.code}>
                            <button
                                type="button"
                                className={s.topicRow}
                                aria-pressed={i === active}
                                onClick={() => setActive(i)}
                            >
                                <span className={s.topicCode}>{t.code}</span>
                                <span className={s.topicName}>
                                    {t.isNext ? <span className={s.archDot} aria-hidden /> : null}
                                    {t.name}
                                </span>
                                <span className={s.topicScore}>{t.score}%</span>
                            </button>
                        </li>
                    ))}
                </ul>
                <p className={s.nextUp} data-reveal>
                    <span className={s.archDot} aria-hidden />
                    {nextUp}
                </p>
            </div>
        </div>
    );
}

type Step = { title: string; body: string; img: string; alt: string };

/* How it works: a horizontal accordion of three green bays, dark to light. */
export function StepBays({ steps }: { steps: Step[] }) {
    const [open, setOpen] = useState(0);
    return (
        <ol className={s.bays}>
            {steps.map((step, i) => {
                const isOpen = i === open;
                return (
                    <li key={step.title} className={`${s.bay} ${s[`bay${i}`]} ${isOpen ? s.bayOpen : ""}`}>
                        <h3 className={s.bayHeading}>
                            <button
                                type="button"
                                className={s.bayButton}
                                aria-expanded={isOpen}
                                aria-controls={`bay-${i}`}
                                onClick={() => setOpen(i)}
                            >
                                {step.title}
                            </button>
                        </h3>
                        <div id={`bay-${i}`} className={s.bayBody} hidden={!isOpen}>
                            <p className={s.bayText}>{step.body}</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={step.img} alt={step.alt} width={800} height={1000} loading="lazy" className={s.bayImg} />
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

/* Section entrances: only elements below the fold are held back, so nothing is hidden without script. */
export function Reveals() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!("IntersectionObserver" in window)) return;
        const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add(s.revealIn);
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
        );
        const groups = new Map<Element | null, number>();
        for (const el of targets) {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
            const parent = el.closest("section, footer");
            const n = groups.get(parent) ?? 0;
            groups.set(parent, n + 1);
            el.style.setProperty("--i", String(n));
            el.classList.add(s.revealWait);
            io.observe(el);
        }
        const safety = window.setTimeout(() => {
            for (const el of targets) {
                const r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) el.classList.add(s.revealIn);
            }
        }, 3000);
        return () => {
            io.disconnect();
            window.clearTimeout(safety);
        };
    }, []);
    return null;
}
