"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Topic = {
    code: string;
    name: string;
    score: number;
    level: string;
    isNext?: boolean;
};

type Mastery = {
    unitCode: string;
    unitName: string;
    examCountdown: string;
    topics: readonly Topic[];
    nextUp: string;
};

const LEVEL_TONE: Record<string, string> = {
    strong: styles.toneStrong,
    developing: styles.toneDeveloping,
    weak: styles.toneWeak,
};

/** A ring that fills to `score` out of 100: the page's one motif, from a reef ring to a topic's mastery. */
export function Ring({ score, className }: { score: number; className?: string }) {
    return (
        <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
            <circle className={styles.ringTrack} cx="50" cy="50" r="42" pathLength={100} />
            <circle
                className={styles.ringFill}
                cx="50"
                cy="50"
                r="42"
                pathLength={100}
                strokeDasharray={`${score} 100`}
                transform="rotate(-90 50 50)"
            />
        </svg>
    );
}

export function MasteryShowcase({ data, headingId }: { data: Mastery; headingId: string }) {
    const initial = Math.max(
        0,
        data.topics.findIndex((t) => t.isNext),
    );
    const [active, setActive] = useState(initial);
    const topic = data.topics[active];

    return (
        <div className={styles.showcaseGrid}>
            <figure className={`${styles.plate} ${styles.rise}`}>
                <img
                    className={styles.photo}
                    src="/design-lab/soft-minimal-taste/guriadhoo-2019-aerial-view-luka-peternel.jpg"
                    width={1920}
                    height={1496}
                    alt="Aerial view of reef rings and islands in Kaafu Atoll, Maldives"
                    loading="lazy"
                    decoding="async"
                />
                <Ring score={topic.score} className={styles.plateRing} />
                <div className={styles.plateDot} aria-live="polite">
                    <span className={styles.plateScore}>{topic.score}%</span>
                    <span className={styles.plateCode}>{topic.code}</span>
                </div>
            </figure>

            <div className={styles.showcaseText}>
                <div className={`${styles.unitHead} ${styles.rise}`}>
                    <h2 id={headingId} className={styles.head}>
                        {data.unitCode} {data.unitName}
                    </h2>
                    <p className={styles.countdown}>{data.examCountdown}</p>
                </div>

                <ul className={`${styles.topicList} ${styles.rise}`} aria-label={`${data.unitCode} topics`}>
                    {data.topics.map((t, i) => (
                        <li key={t.code}>
                            <button
                                type="button"
                                className={`${styles.topicRow} ${i === active ? styles.topicActive : ""}`}
                                aria-pressed={i === active}
                                onClick={() => setActive(i)}
                            >
                                <Ring score={t.score} className={`${styles.miniRing} ${LEVEL_TONE[t.level] ?? ""}`} />
                                <span className={styles.topicCode}>{t.code}</span>
                                <span className={styles.topicName}>{t.name}</span>
                                <span className={styles.topicLevel}>{t.level}</span>
                                <span className={styles.topicScore}>{t.score}%</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <p className={`${styles.nextUp} ${styles.rise}`}>
                    <span className={styles.nextDot} aria-hidden="true" />
                    {data.nextUp}
                </p>
            </div>
        </div>
    );
}

type Step = { title: string; body: string };

const STEP_PICTURES = [
    {
        src: "/design-lab/soft-minimal-taste/male-total.jpg",
        w: 1920,
        h: 1280,
        alt: "Aerial view of Malé, the capital island of the Maldives",
    },
    {
        src: "/design-lab/soft-minimal-taste/eureka-archimede.jpg",
        w: 850,
        h: 508,
        alt: "1737 engraving of Archimedes running from his bath",
    },
    {
        src: "/design-lab/soft-minimal-taste/ari-atoll-passes.jpg",
        w: 1000,
        h: 1504,
        alt: "The eastern reef of Ari Atoll seen from a seaplane",
    },
];

export function StepsAccordion({ steps }: { steps: readonly Step[] }) {
    const [open, setOpen] = useState(0);

    return (
        <ol className={`${styles.accordion} ${styles.rise}`}>
            {steps.map((step, i) => {
                const isOpen = i === open;
                const pic = STEP_PICTURES[i % STEP_PICTURES.length];
                return (
                    <li
                        key={step.title}
                        className={`${styles.stage} ${styles[`stage${i}`]} ${isOpen ? styles.stageOpen : ""}`}
                    >
                        <h3 className={styles.stageHeading}>
                            <button
                                type="button"
                                className={styles.stageButton}
                                aria-expanded={isOpen}
                                aria-controls={`step-panel-${i}`}
                                onClick={() => setOpen(i)}
                            >
                                <span className={styles.stageName}>{step.title}</span>
                            </button>
                        </h3>
                        <div id={`step-panel-${i}`} className={styles.stageBody} hidden={!isOpen}>
                            <p className={styles.stageText}>{step.body}</p>
                            <img
                                className={`${styles.photo} ${styles.stagePhoto}`}
                                src={pic.src}
                                width={pic.w}
                                height={pic.h}
                                alt={pic.alt}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

/**
 * Section entrances. Content is visible by default; only once this runs are below-the-fold parts armed,
 * and each is revealed (once) as it enters the screen. Reduced motion: nothing is armed.
 */
export function Reveal() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const items = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.rise}`));
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue;
                    e.target.classList.add(styles.shown);
                    io.unobserve(e.target);
                }
            },
            { rootMargin: "0px 0px -8% 0px" },
        );
        const vh = window.innerHeight;
        const counts = new Map<Element | null, number>();
        for (const el of items) {
            if (el.getBoundingClientRect().top < vh * 0.92) continue;
            const n = counts.get(el.parentElement) ?? 0;
            counts.set(el.parentElement, n + 1);
            el.style.setProperty("--stagger", `${Math.min(n, 6) * 80}ms`);
            el.classList.add(styles.armed);
            io.observe(el);
        }
        return () => io.disconnect();
    }, []);
    return null;
}
