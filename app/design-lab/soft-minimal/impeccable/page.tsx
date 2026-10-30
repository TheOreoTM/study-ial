import type { Metadata } from "next";
import Link from "next/link";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import { content } from "@/design-lab/content";
import styles from "./page.module.css";

const zen = Zen_Kaku_Gothic_New({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--sm-font",
});

export const metadata: Metadata = { title: "Soft Minimal · Impeccable", robots: { index: false } };

function Arrow({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Check() {
    return (
        <svg className={styles.check} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Mark() {
    return (
        <svg className={styles.mark} viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
            <rect x="1.5" y="1.5" width="17" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <rect x="11" y="11" width="4.5" height="4.5" rx="0.6" className={styles.markDot} />
        </svg>
    );
}

export default function SoftMinimalImpeccable() {
    const { brand, nav, hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer } = content;

    return (
        <div className={`${zen.variable} ${styles.page}`}>
            <a href="#main" className={styles.skip}>
                Skip to content
            </a>

            <header className={styles.nav}>
                <div className={styles.wrap}>
                    <Link href="/" className={styles.brand}>
                        <Mark />
                        <span>{brand}</span>
                    </Link>
                    <nav aria-label="Primary" className={styles.navLinks}>
                        {nav.links.map((l) => (
                            <a key={l.href} href={l.href} className={`${styles.navLink} ${styles.hideSm}`}>
                                {l.label}
                            </a>
                        ))}
                        <a href={nav.signIn.href} className={styles.navLink}>
                            {nav.signIn.label}
                        </a>
                        <a href={nav.primary.href} className={`${styles.btn} ${styles.btnSm}`}>
                            {nav.primary.label}
                        </a>
                    </nav>
                </div>
            </header>

            <main id="main">
                {/* Hero */}
                <section className={styles.hero} aria-labelledby="hero-title">
                    <div className={`${styles.wrap} ${styles.heroGrid}`}>
                        <h1 id="hero-title" className={styles.headline}>
                            {hero.headline}
                        </h1>
                        <div className={styles.heroSide}>
                            <p className={styles.subtext}>{hero.subtext}</p>
                            <div className={styles.ctas}>
                                <a href={hero.primaryCta.href} className={styles.btn}>
                                    {hero.primaryCta.label}
                                    <Arrow className={styles.btnArrow} />
                                </a>
                                <a href={hero.secondaryCta.href} className={styles.textLink}>
                                    {hero.secondaryCta.label}
                                </a>
                            </div>
                            <p className={styles.audience}>{hero.audience}</p>
                        </div>
                    </div>

                    {/* The label: the product mechanism, shown */}
                    <div className={styles.wrap}>
                        <figure className={styles.label} aria-labelledby="label-unit">
                            <div className={styles.labelHead}>
                                <p id="label-unit" className={styles.unit}>
                                    <span className={styles.unitCode}>{m.unitCode}</span>
                                    <span className={styles.unitName}>{m.unitName}</span>
                                </p>
                                <p className={styles.countdown}>{m.examCountdown}</p>
                            </div>

                            <ol className={styles.topics}>
                                {m.topics.map((t) => {
                                    const next = "isNext" in t && t.isNext;
                                    return (
                                        <li
                                            key={t.code}
                                            className={`${styles.topic} ${next ? styles.topicNext : ""}`}
                                            data-level={t.level}
                                        >
                                            <span className={styles.topicCode}>{t.code}</span>
                                            <span className={styles.topicName}>
                                                {t.name}
                                                {next && <span className={styles.srOnly}> (next up)</span>}
                                            </span>
                                            <span className={styles.meter} aria-hidden="true">
                                                <span
                                                    className={styles.meterFill}
                                                    style={{ "--score": t.score / 100 } as React.CSSProperties}
                                                />
                                            </span>
                                            <span className={styles.score}>
                                                {t.score}
                                                <span className={styles.pct}>%</span>
                                                <span className={styles.srOnly}> mastery, {t.level}</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>

                            <figcaption className={styles.nextUp}>
                                <span className={styles.nextDot} aria-hidden="true" />
                                {m.nextUp}
                            </figcaption>
                        </figure>

                        <ul className={styles.stats} aria-label="At a glance">
                            {stats.map((s) => (
                                <li key={s.label}>
                                    <span className={styles.statValue}>{s.value}</span> {s.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* How it works */}
                <section className={styles.section} aria-labelledby="how-title">
                    <div className={`${styles.wrap} ${styles.split}`}>
                        <h2 id="how-title" className={styles.h2}>
                            {howItWorks.heading}
                        </h2>
                        <ol className={styles.steps}>
                            {howItWorks.steps.map((s, i) => (
                                <li key={s.title} className={styles.step}>
                                    <span className={styles.stepNum} aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className={styles.h3}>{s.title}</h3>
                                        <p className={styles.body}>{s.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Features */}
                <section className={`${styles.section} ${styles.band}`} aria-labelledby="features-title">
                    <div className={styles.wrap}>
                        <h2 id="features-title" className={`${styles.h2} ${styles.h2Wide}`}>
                            {features.heading}
                        </h2>
                        <dl className={styles.features}>
                            {features.items.map((f) => (
                                <div key={f.title} className={styles.feature}>
                                    <dt className={styles.h3}>{f.title}</dt>
                                    <dd className={styles.body}>{f.body}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* Subjects */}
                <section className={styles.section} aria-labelledby="subjects-title">
                    <div className={`${styles.wrap} ${styles.split}`}>
                        <h2 id="subjects-title" className={styles.h2}>
                            {subjects.heading}
                        </h2>
                        <ul className={styles.subjects}>
                            {subjects.items.map((s) => (
                                <li key={s.href}>
                                    <a href={s.href} className={styles.subject}>
                                        <span className={styles.subjectName}>{s.name}</span>
                                        <span className={styles.subjectUnits}>
                                            {s.units} units
                                        </span>
                                        <Arrow className={styles.subjectArrow} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Closing */}
                <section className={styles.closing} aria-labelledby="closing-title">
                    <div className={`${styles.wrap} ${styles.closingInner}`}>
                        <h2 id="closing-title" className={styles.closingHeadline}>
                            {closing.headline}
                        </h2>
                        <div className={styles.closingSide}>
                            <ul className={styles.points}>
                                {closing.points.map((p) => (
                                    <li key={p}>
                                        <Check />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                            <a href={closing.cta.href} className={styles.btn}>
                                {closing.cta.label}
                                <Arrow className={styles.btnArrow} />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={`${styles.wrap} ${styles.footerInner}`}>
                    <span className={styles.brandSmall}>
                        <Mark />
                        {brand}
                    </span>
                    <p>{footer.copyright}</p>
                    <p>{footer.disclaimer}</p>
                </div>
            </footer>
        </div>
    );
}
