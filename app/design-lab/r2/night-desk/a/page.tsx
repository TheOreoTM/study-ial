import { Hanken_Grotesk, Young_Serif } from "next/font/google";
import { content } from "@/design-lab/content";
import { Lamp, LampMark, Arrow, Check } from "./icons";
import s from "./night-desk.module.css";

export const metadata = { title: "Night Desk · R2 A", robots: { index: false } };

const display = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--nd-display", display: "swap" });
const text = Hanken_Grotesk({ subsets: ["latin"], variable: "--nd-text", display: "swap" });

const levelClass = { strong: s.strong, developing: s.developing, weak: s.weak } as const;

export default function NightDeskPage() {
    const { nav, hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer } = content;

    return (
        <div className={`${s.page} ${display.variable} ${text.variable}`}>
            <a href="#main" className={s.skip}>
                Skip to content
            </a>

            <header className={s.nav}>
                <a href="#top" className={s.brand} aria-label={`${content.brand} home`}>
                    <LampMark className={s.brandMark} />
                    <span>{content.brand}</span>
                </a>
                <nav aria-label="Main" className={s.navLinks}>
                    {nav.links.map((l) => (
                        <a key={l.href} href={l.href} className={s.navLink}>
                            {l.label}
                        </a>
                    ))}
                    <a href={nav.signIn.href} className={s.navLink}>
                        {nav.signIn.label}
                    </a>
                    <a href={nav.primary.href} className={`${s.btn} ${s.btnSmall}`}>
                        {nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="main">
                {/* Hero: the lamp lights the topic to revise next */}
                <section className={s.hero} id="top" aria-labelledby="hero-title">
                    <div className={s.heroCopy}>
                        <h1 id="hero-title" className={s.headline}>
                            {hero.headline}
                        </h1>
                        <p className={s.subtext}>{hero.subtext}</p>
                        <div className={s.ctas}>
                            <a href={hero.primaryCta.href} className={`${s.btn} ${s.btnLarge}`}>
                                {hero.primaryCta.label}
                                <Arrow className={s.btnIcon} />
                            </a>
                            <a href={hero.secondaryCta.href} className={s.btnGhost}>
                                {hero.secondaryCta.label}
                            </a>
                        </div>
                        <p className={s.audience}>{hero.audience}</p>
                    </div>

                    <div className={s.scene}>
                        <figure className={s.desk} aria-label={`Example: ${m.unitCode} ${m.unitName} topic mastery`}>
                            <div className={s.lampWrap} aria-hidden="true">
                                <Lamp className={s.lamp} />
                            </div>
                            <div className={s.deskHead}>
                                <div>
                                    <p className={s.unitCode}>{m.unitCode}</p>
                                    <p className={s.unitName}>{m.unitName}</p>
                                </div>
                                <p className={s.countdown}>{m.examCountdown}</p>
                            </div>

                            <ol className={s.topics}>
                                {m.topics.map((t) => {
                                    const isNext = "isNext" in t && t.isNext;
                                    return (
                                        <li
                                            key={t.code}
                                            className={`${s.topic} ${levelClass[t.level]} ${isNext ? s.lit : ""}`}
                                        >
                                            {isNext && (
                                                <span className={s.beam} aria-hidden="true">
                                                    <span />
                                                </span>
                                            )}
                                            <span className={s.topicCode}>{t.code}</span>{" "}
                                            <span className={s.topicName}>
                                                {t.name}
                                                {isNext && <span className={s.srOnly}> (next up)</span>}
                                            </span>{" "}
                                            <span className={s.topicScore}>
                                                {t.score}% <span className={s.topicLevel}>{t.level}</span>
                                            </span>
                                            <span className={s.meter} aria-hidden="true">
                                                <span style={{ width: `${t.score}%` }} />
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>

                            <figcaption className={s.nextUp}>
                                <LampMark className={s.nextUpMark} />
                                {m.nextUp}
                            </figcaption>
                        </figure>
                    </div>
                </section>

                <section className={s.stats} aria-label="At a glance">
                    <ul className={s.statList}>
                        {stats.map((st) => (
                            <li key={st.label} className={s.stat}>
                                <span className={s.statValue}>{st.value}</span>{" "}
                                <span className={s.statLabel}>{st.label}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={`${s.section} ${s.howSection}`} aria-labelledby="how-title">
                    <h2 id="how-title" className={s.h2}>
                        {howItWorks.heading}
                    </h2>
                    <ol className={s.steps}>
                        {howItWorks.steps.map((step, i) => (
                            <li key={step.title} className={s.step}>
                                <span className={s.stepNum} aria-hidden="true">
                                    {i + 1}
                                </span>
                                <h3 className={s.h3}>{step.title}</h3>
                                <p className={s.body}>{step.body}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className={s.band}>
                    <section className={`${s.section} ${s.split}`} aria-labelledby="features-title">
                        <h2 id="features-title" className={`${s.h2} ${s.splitHeading}`}>
                            {features.heading}
                        </h2>
                        <ul className={s.features}>
                            {features.items.map((f) => (
                                <li key={f.title} className={s.feature}>
                                    <h3 className={s.h3}>{f.title}</h3>
                                    <p className={s.body}>{f.body}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className={`${s.section} ${s.split}`} aria-labelledby="subjects-title">
                    <h2 id="subjects-title" className={`${s.h2} ${s.splitHeading}`}>
                        {subjects.heading}
                    </h2>
                    <ul className={s.subjects}>
                        {subjects.items.map((sub) => (
                            <li key={sub.href}>
                                <a href={sub.href} className={s.subject}>
                                    <span className={s.subjectName}>{sub.name}</span>{" "}
                                    <span className={s.subjectUnits}>{sub.units} units</span>
                                    <Arrow className={s.subjectArrow} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={s.closing} aria-labelledby="closing-title">
                    <div className={s.closingLight} aria-hidden="true">
                        <LampMark className={s.closingMark} />
                    </div>
                    <h2 id="closing-title" className={s.closingHeadline}>
                        {closing.headline}
                    </h2>
                    <ul className={s.points}>
                        {closing.points.map((p) => (
                            <li key={p}>
                                <Check className={s.pointIcon} />
                                {p}
                            </li>
                        ))}
                    </ul>
                    <a href={closing.cta.href} className={`${s.btn} ${s.btnLarge}`}>
                        {closing.cta.label}
                        <Arrow className={s.btnIcon} />
                    </a>
                </section>
            </main>

            <footer className={s.footer}>
                <p>{footer.copyright}</p>
                <p>{footer.disclaimer}</p>
            </footer>
        </div>
    );
}
