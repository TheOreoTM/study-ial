import { Baloo_2, Figtree } from "next/font/google";
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Atom,
    CalendarClock,
    CalendarRange,
    Check,
    FlaskConical,
    Gauge,
    GraduationCap,
    Infinity as InfinityIcon,
    Leaf,
    ListChecks,
    Play,
    Sigma,
    Timer,
    Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { content } from "@/design-lab/content";

import s from "./page.module.css";

export const metadata = { title: "Playful Pop · Impeccable", robots: { index: false } };

const display = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--pp-display" });
const body = Figtree({ subsets: ["latin"], variable: "--pp-body" });

const { nav, hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer } = content;

const featureIcons: LucideIcon[] = [ListChecks, Gauge, CalendarRange, Zap, Timer, GraduationCap];
const featureTones = [s.toneSun, s.toneGumPale, s.toneLimePale, s.toneGrape, s.toneWhite, s.toneLagoon];
const stepTones = [s.stepSun, s.stepGum, s.stepLagoon];
const subjectIcons: LucideIcon[] = [Atom, FlaskConical, Leaf, Sigma, InfinityIcon];
const subjectTones = [s.subLagoon, s.subSun, s.subLime, s.subGrape, s.subGum];
const stickerTones = [s.stickerSun, s.stickerLagoon, s.stickerGum];

const levelClass: Record<string, string> = {
    strong: s.levelStrong,
    developing: s.levelDeveloping,
    weak: s.levelWeak,
};

function Logo() {
    return (
        <svg className={s.logo} viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="13" fill="currentColor" />
            <rect x="9" y="22" width="6" height="9" rx="3" fill="#FFD23F" />
            <rect x="17" y="16" width="6" height="15" rx="3" fill="#FF8FB8" />
            <rect x="25" y="9" width="6" height="22" rx="3" fill="#2EC4B6" />
        </svg>
    );
}

function MasteryBoard() {
    return (
        <figure className={s.board} aria-label={`Example: ${m.unitCode} ${m.unitName} topic mastery`}>
            <div className={s.boardHead}>
                <span className={s.unitChip}>{m.unitCode}</span>
                <span className={s.unitName}>{m.unitName}</span>
                <span className={s.countdown}>
                    <CalendarClock aria-hidden="true" size={16} strokeWidth={2.5} />
                    {m.examCountdown}
                </span>
            </div>
            <ul className={s.topics}>
                {m.topics.map((t, i) => {
                    const isNext = "isNext" in t && t.isNext;
                    return (
                        <li
                            key={t.code}
                            className={`${s.topic} ${levelClass[t.level]} ${isNext ? s.topicNext : ""}`}
                            style={{ "--score": `${t.score}%`, "--i": i } as CSSProperties}
                        >
                            <span className={s.topicCode}>{t.code}</span>
                            <span className={s.topicName}>{t.name}</span>
                            <span className={s.topicScore}>{t.score}%</span>
                            <span className={s.bar} aria-hidden="true">
                                <span className={s.barFill} />
                            </span>
                            <span className={s.topicLevel}>{t.level}</span>
                            {isNext ? (
                                <span className={s.nextFlag} aria-hidden="true">
                                    <ArrowRight size={18} strokeWidth={3} />
                                </span>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
            <figcaption className={s.nextUp}>
                <span className={s.nextUpIcon} aria-hidden="true">
                    <Play size={16} strokeWidth={3} fill="currentColor" />
                </span>
                {m.nextUp}
            </figcaption>
        </figure>
    );
}

export default function PlayfulPopImpeccable() {
    return (
        <div className={`${s.page} ${display.variable} ${body.variable}`}>
            <a className={s.skip} href="#main">
                Skip to content
            </a>

            <header className={s.heroField}>
                <nav className={s.nav} aria-label="Main">
                    <Link className={s.brand} href="/">
                        <Logo />
                        <span>{content.brand}</span>
                    </Link>
                    <div className={s.navRight}>
                        {nav.links.map((l) => (
                            <a key={l.href} className={s.navLink} href={l.href}>
                                {l.label}
                            </a>
                        ))}
                        <a className={s.navLink} href={nav.signIn.href}>
                            {nav.signIn.label}
                        </a>
                        <a className={s.navCta} href={nav.primary.href}>
                            {nav.primary.label}
                        </a>
                    </div>
                </nav>

                <div className={s.hero}>
                    <h1 className={s.headline}>{hero.headline}</h1>
                    <div className={s.heroCopy}>
                        <p className={s.subtext}>{hero.subtext}</p>
                        <div className={s.ctas}>
                            <a className={s.btnPrimary} href={hero.primaryCta.href}>
                                {hero.primaryCta.label}
                                <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
                            </a>
                            <a className={s.btnGhost} href={hero.secondaryCta.href}>
                                {hero.secondaryCta.label}
                            </a>
                        </div>
                        <p className={s.audience}>
                            <GraduationCap aria-hidden="true" size={18} strokeWidth={2.5} />
                            {hero.audience}
                        </p>
                        <ul className={s.stickers} aria-label="At a glance">
                            {stats.map((st, i) => (
                                <li key={st.label} className={`${s.sticker} ${stickerTones[i]}`}>
                                    <span className={s.stickerValue}>{st.value}</span>
                                    <span className={s.stickerLabel}>{st.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={s.boardWrap}>
                        <MasteryBoard />
                    </div>
                </div>
            </header>

            <main id="main">
                <section className={s.how} aria-labelledby="how-title">
                    <div className={s.inner}>
                        <h2 id="how-title" className={s.h2}>
                            {howItWorks.heading}
                        </h2>
                        <ol className={s.steps}>
                            {howItWorks.steps.map((step, i) => {
                                return (
                                    <li key={step.title} className={s.step}>
                                        <span className={`${s.stepBadge} ${stepTones[i]}`} aria-hidden="true">
                                            <span className={s.stepNum}>{i + 1}</span>
                                        </span>
                                        {i < howItWorks.steps.length - 1 ? (
                                            <svg
                                                className={s.connector}
                                                viewBox="0 0 100 56"
                                                preserveAspectRatio="none"
                                                aria-hidden="true"
                                            >
                                                <path d="M0 2 C 45 2, 55 54, 100 54" />
                                            </svg>
                                        ) : null}
                                        <h3 className={s.stepTitle}>{step.title}</h3>
                                        <p className={s.stepBody}>{step.body}</p>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </section>

                <section className={s.features} aria-labelledby="features-title">
                    <div className={s.inner}>
                        <h2 id="features-title" className={`${s.h2} ${s.h2Wide}`}>
                            {features.heading}
                        </h2>
                        <ul className={s.bento}>
                            {features.items.map((f, i) => {
                                const Icon = featureIcons[i];
                                return (
                                    <li key={f.title} className={`${s.tile} ${s[`tile${i}`]} ${featureTones[i]}`}>
                                        <span className={s.tileIcon} aria-hidden="true">
                                            <Icon size={26} strokeWidth={2.5} />
                                        </span>
                                        <h3 className={s.tileTitle}>{f.title}</h3>
                                        <p className={s.tileBody}>{f.body}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>

                <section className={s.subjects} aria-labelledby="subjects-title">
                    <div className={s.inner}>
                        <h2 id="subjects-title" className={s.h2}>
                            {subjects.heading}
                        </h2>
                        <ul className={s.subjectGrid}>
                            {subjects.items.map((sub, i) => {
                                const Icon = subjectIcons[i];
                                return (
                                    <li key={sub.name} className={s.subjectItem}>
                                        <a className={`${s.subject} ${subjectTones[i]}`} href={sub.href}>
                                            <span className={s.subjectGlyph} aria-hidden="true">
                                                <Icon size={40} strokeWidth={2.25} />
                                            </span>
                                            <span className={s.subjectName}>{sub.name}</span>
                                            <span className={s.subjectUnits}>
                                                <strong>{sub.units}</strong> units
                                            </span>
                                            <ArrowUpRight
                                                className={s.subjectArrow}
                                                aria-hidden="true"
                                                size={24}
                                                strokeWidth={2.75}
                                            />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>

                <section className={s.closing} aria-labelledby="closing-title">
                    <div className={s.closingInner}>
                        <h2 id="closing-title" className={s.closingHeadline}>
                            {closing.headline}
                        </h2>
                        <ul className={s.points}>
                            {closing.points.map((p) => (
                                <li key={p}>
                                    <span className={s.pointCheck} aria-hidden="true">
                                        <Check size={16} strokeWidth={3.5} />
                                    </span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                        <a className={s.btnSun} href={closing.cta.href}>
                            {closing.cta.label}
                            <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
                        </a>
                    </div>
                </section>
            </main>

            <footer className={s.footer}>
                <div className={s.footerInner}>
                    <span className={s.footerBrand}>
                        <Logo />
                        {content.brand}
                    </span>
                    <p>{footer.copyright}</p>
                    <p>{footer.disclaimer}</p>
                </div>
            </footer>
        </div>
    );
}
