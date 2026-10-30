"use client";

import { useState } from "react";

import type { LabContent } from "@/design-lab/content";

import styles from "./page.module.css";

type Props = {
    example: LabContent["masteryExample"];
    picture: { src: string; alt: string };
};

const R = 46;
const C = 2 * Math.PI * R;

/** The live thing: pick a topic and the ring of lamplight around the desk fills to its mastery score. */
export function MasteryPlate({ example, picture }: Props) {
    const nextIndex = example.topics.findIndex((t) => "isNext" in t && t.isNext);
    const [active, setActive] = useState(nextIndex < 0 ? 0 : nextIndex);
    const topic = example.topics[active];

    return (
        <section className={styles.showcase} aria-labelledby="mastery-title">
            <figure className={styles.plate} data-reveal>
                <img src={picture.src} alt={picture.alt} width={1200} height={1200} loading="lazy" />
                <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
                    <circle className={styles.ringTrack} cx="50" cy="50" r={R} />
                    <circle
                        className={styles.ringFill}
                        cx="50"
                        cy="50"
                        r={R}
                        style={{ strokeDasharray: `${C}`, strokeDashoffset: `${C * (1 - topic.score / 100)}` }}
                        data-level={topic.level}
                    />
                </svg>
                <span className={styles.ringScore} aria-hidden="true">
                    {topic.score}%
                </span>
            </figure>

            <div className={styles.plateText}>
                <div>
                    <h2 id="mastery-title" className={styles.plateTitle} data-reveal>
                        {example.unitCode} {example.unitName}
                    </h2>
                    <p className={styles.plateCountdown} data-reveal>
                        {example.examCountdown}
                    </p>
                </div>

                <ul className={styles.topicList} aria-label={`${example.unitCode} topics`} data-reveal>
                    {example.topics.map((t, i) => (
                        <li key={t.code}>
                            <button
                                type="button"
                                className={styles.topic}
                                aria-pressed={i === active}
                                data-level={t.level}
                                onClick={() => setActive(i)}
                            >
                                <span className={styles.topicCode}>{t.code}</span>
                                <span className={styles.topicName}>
                                    {t.name}
                                    <span className={styles.topicLevel}>{t.level}</span>
                                </span>
                                <span className={styles.topicScore}>{t.score}%</span>
                                {"isNext" in t && t.isNext ? (
                                    <span className={styles.topicNext} aria-label="next up" />
                                ) : null}
                            </button>
                        </li>
                    ))}
                </ul>

                <p className={styles.nextUp} data-reveal>
                    <span className={styles.dot} aria-hidden="true" />
                    {example.nextUp}
                </p>
            </div>
        </section>
    );
}
