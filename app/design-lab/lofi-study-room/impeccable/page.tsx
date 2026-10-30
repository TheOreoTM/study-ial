import { Fredoka, M_PLUS_Rounded_1c } from "next/font/google";
import { CalendarClock, Check, Play } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { content } from "@/design-lab/content";

import { Cassette, DuskWindow, PendantLamp, Reel } from "./scene";
import styles from "./page.module.css";

export const metadata = { title: "Lo-fi Study Room · Impeccable", robots: { index: false } };

const display = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--lsr-display" });
const text = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--lsr-text" });

const spineTones = ["terracotta", "mustard", "sage", "rose", "teal"] as const;

const { hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer, nav } = content;

function Meter({ score, level }: { score: number; level: string }) {
    const lit = Math.round(score / 10);
    return (
        <span className={styles.meter} data-level={level} aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={i < lit ? styles.segOn : styles.segOff} />
            ))}
        </span>
    );
}

export default function LofiStudyRoomImpeccable() {
    return (
        <div className={`${styles.room} ${display.variable} ${text.variable}`}>
            <a className={styles.skip} href="#lsr-main">
                Skip to content
            </a>
            <header className={styles.nav}>
                <Link className={styles.brand} href="/">
                    <Reel className={styles.brandReel} />
                    {content.brand}
                </Link>
                <nav aria-label="Main" className={styles.navLinks}>
                    {nav.links.map((l) => (
                        <a key={l.href} className={styles.navLink} href={l.href}>
                            {l.label}
                        </a>
                    ))}
                    <a className={styles.navLink} href={nav.signIn.href}>
                        {nav.signIn.label}
                    </a>
                    <a className={`${styles.btn} ${styles.btnSmall}`} href={nav.primary.href}>
                        {nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="lsr-main">
                {/* ── Hero: the room at dusk ─────────────────────────── */}
                <section className={styles.hero} aria-labelledby="lsr-hero-title">
                    <div className={styles.heroCopy}>
                        <div className={styles.lamp} aria-hidden="true">
                            <PendantLamp />
                            <span className={styles.lampGlow} />
                        </div>
                        <h1 id="lsr-hero-title" className={styles.headline}>
                            {hero.headline}
                        </h1>
                        <p className={styles.subtext}>{hero.subtext}</p>
                        <div className={styles.ctas}>
                            <a className={styles.btn} href={hero.primaryCta.href}>
                                {hero.primaryCta.label}
                            </a>
                            <a className={`${styles.btn} ${styles.btnGhost}`} href={hero.secondaryCta.href}>
                                {hero.secondaryCta.label}
                            </a>
                        </div>
                    </div>

                    <div className={styles.proof}>
                        <p className={styles.audience}>{hero.audience}</p>
                        <dl className={styles.stats}>
                            {stats.map((s) => (
                                <div key={s.label} className={styles.stat}>
                                    <dt className={styles.statLabel}>{s.label}</dt>
                                    <dd className={styles.statValue}>{s.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className={styles.heroScene}>
                        <DuskWindow />

                        {/* The tape deck: one unit's topics as a tracklist, weakest cued next. */}
                        <figure className={styles.deck} aria-labelledby="lsr-deck-title">
                            <div className={styles.deckLabel}>
                                <div>
                                    <p id="lsr-deck-title" className={styles.deckCode}>
                                        {m.unitCode}
                                    </p>
                                    <p className={styles.deckName}>{m.unitName}</p>
                                </div>
                                <p className={styles.countdown}>
                                    <CalendarClock aria-hidden="true" size={16} strokeWidth={2.25} />
                                    {m.examCountdown}
                                </p>
                            </div>

                            <Cassette />

                            <ol className={styles.tracks}>
                                {m.topics.map((t) => {
                                    const isNext = "isNext" in t && t.isNext;
                                    return (
                                        <li
                                            key={t.code}
                                            className={`${styles.track} ${isNext ? styles.trackCued : ""}`}
                                            data-level={t.level}
                                        >
                                            <span className={styles.trackCode}>
                                                {isNext ? (
                                                    <Play
                                                        className={styles.cueIcon}
                                                        aria-hidden="true"
                                                        size={14}
                                                        strokeWidth={0}
                                                        fill="currentColor"
                                                    />
                                                ) : null}
                                                {t.code}
                                            </span>
                                            <span className={styles.trackName}>
                                                {t.name}
                                                {isNext ? <span className={styles.srOnly}> (next up)</span> : null}
                                                <span className={styles.trackLevel}>{t.level}</span>
                                            </span>
                                            <Meter score={t.score} level={t.level} />
                                            <span className={styles.trackScore}>{t.score}%</span>
                                        </li>
                                    );
                                })}
                            </ol>

                            <figcaption className={styles.nextUp}>
                                <span className={styles.nextUpDot} aria-hidden="true">
                                    <Play size={12} strokeWidth={0} fill="currentColor" />
                                </span>
                                {m.nextUp}
                            </figcaption>
                        </figure>
                    </div>
                </section>

                {/* ── How it works: one tape run ─────────────────────── */}
                <section className={styles.how} aria-labelledby="lsr-how">
                    <h2 id="lsr-how" className={styles.h2}>
                        {howItWorks.heading}
                    </h2>
                    <ol className={styles.steps}>
                        {howItWorks.steps.map((s, i) => (
                            <li key={s.title} className={styles.step} style={{ "--i": i } as CSSProperties}>
                                <span className={styles.stepReel} aria-hidden="true">
                                    {i + 1}
                                </span>
                                <h3 className={styles.h3}>{s.title}</h3>
                                <p className={styles.body}>{s.body}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* ── Features: the things on the desk ───────────────── */}
                <section className={styles.features} aria-labelledby="lsr-features">
                    <h2 id="lsr-features" className={styles.h2}>
                        {features.heading}
                    </h2>
                    <div className={styles.jcard}>
                        <ul className={styles.featureList}>
                            {features.items.map((f) => (
                                <li key={f.title} className={styles.feature}>
                                    <h3 className={styles.featureTitle}>{f.title}</h3>
                                    <p className={styles.body}>{f.body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* ── Subjects: the tape shelf ───────────────────────── */}
                <section className={styles.shelfSection} aria-labelledby="lsr-subjects">
                    <div className={styles.shelfRow}>
                        <h2 id="lsr-subjects" className={styles.h2}>
                            {subjects.heading}
                        </h2>
                        <div>
                            <ul className={styles.shelf}>
                                {subjects.items.map((s, i) => (
                                    <li key={s.href} className={styles.spineSlot}>
                                        <a className={styles.spine} href={s.href} data-tone={spineTones[i]}>
                                            <span className={styles.spineBand} aria-hidden="true" />
                                            <span className={styles.spineName}>{s.name}</span>
                                            <span className={styles.spineUnits}>{s.units} units</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.shelfBoard} aria-hidden="true" />
                        </div>
                    </div>
                </section>

                {/* ── Closing: the sun going down ────────────────────── */}
                <section className={styles.closing} aria-labelledby="lsr-closing">
                    <div className={styles.closingSun} aria-hidden="true" />
                    <h2 id="lsr-closing" className={styles.closingHeadline}>
                        {closing.headline}
                    </h2>
                    <ul className={styles.points}>
                        {closing.points.map((p) => (
                            <li key={p}>
                                <Check aria-hidden="true" size={18} strokeWidth={2.75} />
                                {p}
                            </li>
                        ))}
                    </ul>
                    <a className={`${styles.btn} ${styles.btnInk}`} href={closing.cta.href}>
                        {closing.cta.label}
                    </a>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <p>{footer.copyright}</p>
                    <p>{footer.disclaimer}</p>
                </div>
            </footer>
        </div>
    );
}
