"use client";

import { useState } from "react";

import styles from "./page.module.css";

type Props = {
    heading: string;
    steps: ReadonlyArray<{ title: string; body: string }>;
};

/** Accordion of tinted panels: dusk deepening to lamplight, one stage open at a time. */
export function Steps({ heading, steps }: Props) {
    const [open, setOpen] = useState(0);

    return (
        <section className={styles.steps} aria-labelledby="steps-title">
            <h2 id="steps-title" className={styles.sectionTitle} data-reveal>
                {heading}
            </h2>
            <ol className={styles.accordion} data-reveal>
                {steps.map((step, i) => {
                    const isOpen = i === open;
                    return (
                        <li key={step.title} className={styles.stage} data-open={isOpen} data-tone={i}>
                            <h3 className={styles.stageHeading}>
                                <button
                                    type="button"
                                    className={styles.stageButton}
                                    aria-expanded={isOpen}
                                    aria-controls={`stage-${i}`}
                                    onClick={() => setOpen(i)}
                                >
                                    <span className={styles.stageName}>{step.title}</span>
                                </button>
                            </h3>
                            <div id={`stage-${i}`} className={styles.stageBody} hidden={!isOpen}>
                                <span className={styles.stageDisc} aria-hidden="true" />
                                <p>{step.body}</p>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
