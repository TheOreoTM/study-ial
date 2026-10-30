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
    GraduationCap,
    Infinity as InfinityIcon,
    Leaf,
    ListChecks,
    Play,
    Sigma,
    Timer,
    TrendingUp,
    X,
    Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { content } from "@/design-lab/content";

import s from "./page.module.css";

export const metadata = { title: "Playful Pop · R2 B", robots: { index: false } };

const display = Baloo_2({ subsets: ["latin"], weight: ["700", "800"], variable: "--pp-display" });
const body = Figtree({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--pp-body" });

const { nav, hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer } = content;

// Feature 1 ("Mastery you can see") is the lead tile and carries a live-looking mastery strip instead of an icon.
const LEAD_FEATURE = 1;
const featureIcons: (LucideIcon | null)[] = [ListChecks, null, CalendarRange, Zap, Timer, GraduationCap];
const subjectIcons: LucideIcon[] = [Atom, FlaskConical, Leaf, Sigma, InfinityIcon];
// Subject identity colours never reuse the mastery colours (lagoon / sun / gum).
const subjectTones = [s.subGrape, s.subSky, s.subLime, s.subTangerine, s.subLilac];

const levelClass: Record<string, string> = {
    strong: s.levelStrong,
    developing: s.levelDeveloping,
    weak: s.levelWeak,
};

// The last word of the headline gets a hand-drawn underline; the text itself is unchanged.
const headWords = hero.headline.split(" ");
const headLead = headWords.slice(0, -1).join(" ") + " ";
const headLast = headWords[headWords.length - 1];

const weakTopic = m.topics.find((t) => "isNext" in t && t.isNext) ?? m.topics[0];

function Logo() {
    return (
        <svg className={s.logo} viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="13" fill="currentColor" />
            <rect className={s.logoBarA} x="9" y="22" width="6" height="9" rx="3" />
            <rect className={s.logoBarB} x="17" y="16" width="6" height="15" rx="3" />
            <rect className={s.logoBarC} x="25" y="9" width="6" height="22" rx="3" />
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

/* Small product fragments for each step. Decorative: the step text carries the meaning. */
function StepFragment({ index }: { index: number }) {
    if (index === 0) {
        return (
            <div className={`${s.frag} ${s.fragRow}`} aria-hidden="true">
                <span className={s.fragUnit}>{m.unitCode}</span>
                <span className={s.fragUnitName}>{m.unitName}</span>
                <span className={s.fragDate}>
                    <CalendarClock size={14} strokeWidth={2.75} />
                    {m.examCountdown}
                </span>
            </div>
        );
    }
    if (index === 1) {
        const marks = ["ok", "ok", "miss", "ok", "todo"] as const;
        return (
            <div className={s.frag} aria-hidden="true">
                <span className={s.fragTopic}>
                    <span className={s.fragCode}>{weakTopic.code}</span>
                    <span className={s.fragTopicName}>{weakTopic.name}</span>
                </span>
                <span className={s.marks}>
                    {marks.map((mk, i) => (
                        <span key={i} className={`${s.mark} ${s[`mark_${mk}`]}`}>
                            {mk === "ok" ? <Check size={14} strokeWidth={3.5} /> : null}
                            {mk === "miss" ? <X size={14} strokeWidth={3.5} /> : null}
                        </span>
                    ))}
                </span>
            </div>
        );
    }
    return (
        <div className={s.frag} aria-hidden="true">
            <span className={s.fragTopic}>
                <span className={`${s.fragCode} ${s.fragCodeWeak}`}>{weakTopic.code}</span>
                <span className={s.fragScore}>{weakTopic.score}%</span>
                <TrendingUp className={s.fragTrend} size={20} strokeWidth={3} />
            </span>
            <span className={s.fragBar} style={{ "--score": `${weakTopic.score}%` } as CSSProperties}>
                <span className={s.fragBarFill} />
                <span className={s.fragBarGoal} />
            </span>
        </div>
    );
}

function MasteryStrip() {
    return (
        <div className={s.strip} aria-hidden="true">
            {m.topics.map((t) => (
                <span
                    key={t.code}
                    className={`${s.stripRow} ${levelClass[t.level]}`}
                    style={{ "--score": `${t.score}%` } as CSSProperties}
                >
                    <span className={s.stripCode}>{t.code}</span>
                    <span className={s.stripBar}>
                        <span className={s.stripFill} />
                    </span>
                    <span className={s.stripScore}>{t.score}%</span>
                </span>
            ))}
        </div>
    );
}

export default function PlayfulPopR2B() {
    return (
        <div className={`${s.page} ${display.variable} ${body.variable}`}>
            <a className={s.skip} href="#main">
                Skip to content
            </a>

            <header className={s.heroField}>
                <div className={s.heroBars} aria-hidden="true">
                    {[14, 22, 18, 30, 26, 40, 34, 52, 46, 66, 78, 100].map((h) => (
                        <span key={h} style={{ "--h": `${h}%` } as CSSProperties} />
                    ))}
                </div>
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
                    <h1 className={s.headline}>
                        {headLead}
                        <span className={s.headLast}>
                            {headLast}
                            <svg className={s.swoosh} viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M4 16 C 50 6, 120 4, 196 12" />
                            </svg>
                        </span>
                    </h1>
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
                    </div>
                    <div className={s.boardWrap}>
                        <MasteryBoard />
                    </div>
                    <div className={s.heroMeta}>
                        <p className={s.audience}>
                            <GraduationCap aria-hidden="true" size={18} strokeWidth={2.5} />
                            {hero.audience}
                        </p>
                        <ul className={s.stats} aria-label="At a glance">
                            {stats.map((st) => (
                                <li key={st.label} className={s.stat}>
                                    <span className={s.statValue}>{st.value}</span>
                                    <span className={s.statLabel}>{st.label}</span>
                                </li>
                            ))}
                        </ul>
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
                            {howItWorks.steps.map((step, i) => (
                                <li key={step.title} className={s.step}>
                                    <span className={s.stepNode} aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <StepFragment index={i} />
                                    <div className={s.stepText}>
                                        <h3 className={s.stepTitle}>{step.title}</h3>
                                        <p className={s.stepBody}>{step.body}</p>
                                    </div>
                                </li>
                            ))}
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
                                const lead = i === LEAD_FEATURE;
                                return (
                                    <li key={f.title} className={`${s.tile} ${s[`tile${i}`]} ${lead ? s.tileLead : ""}`}>
                                        <h3 className={s.tileTitle}>
                                            {Icon ? (
                                                <span className={s.tileIcon} aria-hidden="true">
                                                    <Icon size={20} strokeWidth={2.5} />
                                                </span>
                                            ) : null}
                                            {f.title}
                                        </h3>
                                        <p className={s.tileBody}>{f.body}</p>
                                        {lead ? <MasteryStrip /> : null}
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
                                                <Icon size={32} strokeWidth={2.25} />
                                            </span>
                                            <span className={s.subjectName}>{sub.name}</span>
                                            <span className={s.subjectUnits}>
                                                <strong>{sub.units}</strong> units
                                            </span>
                                            <span className={s.pips} aria-hidden="true">
                                                {Array.from({ length: sub.units }, (_, n) => (
                                                    <span key={n} />
                                                ))}
                                            </span>
                                            <Icon className={s.subjectBig} aria-hidden="true" size={168} strokeWidth={1.75} />
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
                    <div className={s.closingBars} aria-hidden="true">
                        <span className={s.levelWeak} />
                        <span className={s.levelDeveloping} />
                        <span className={s.levelStrong} />
                    </div>
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
