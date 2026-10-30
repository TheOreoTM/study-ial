import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Atom,
    BookOpen,
    CalendarRange,
    Check,
    FlaskConical,
    GraduationCap,
    Infinity as InfinityIcon,
    Leaf,
    ListChecks,
    Sigma,
    Timer,
    Zap,
    type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

import s from "@/components/landing/landing.module.css";
import { LogoMark, MasteryBoard, MasteryStrip, StepFragment } from "@/components/landing/marketing-parts";
import { db } from "@/lib/db";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";

const steps = [
    {
        title: "Pick your units",
        body: "Tell us which IAL units you're sitting and when. WPH11 in January? We plan around it.",
    },
    {
        title: "Practise by topic",
        body: "Every question is tagged to a specification topic. Answer, mark against the mark scheme, move on.",
    },
    {
        title: "Fix what's weak",
        body: "Your marks build a mastery score per topic, so you always know exactly what to revise next.",
    },
];

// Feature 1 ("Mastery you can see") is the lead tile: it carries a mastery strip instead of an icon.
const LEAD_FEATURE = 1;
const features: { title: string; body: string; icon: LucideIcon | null }[] = [
    {
        title: "Topic-level practice",
        body: "Questions organised the way the specification is, not by paper. Drill one topic until it clicks.",
        icon: ListChecks,
    },
    {
        title: "Mastery you can see",
        body: "Recent marks, weighted toward your latest attempts, show which topics are strong and which need work.",
        icon: null,
    },
    {
        title: "Plans that adapt",
        body: "A day-by-day plan that covers every topic before your exam, adds spaced review, and reshuffles when you fall behind.",
        icon: CalendarRange,
    },
    {
        title: "Instant marking",
        body: "Multiple choice is marked instantly. For written answers, mark yourself against the scheme, or get AI feedback point by point.",
        icon: Zap,
    },
    {
        title: "Focus timer",
        body: "A built-in Pomodoro timer linked to your plan, so starting is the easy part.",
        icon: Timer,
    },
    {
        title: "Built for IAL",
        body: "Edexcel International A Level units and paper codes, plus local subjects for students in the Maldives.",
        icon: GraduationCap,
    },
];
const tileClass = [s.tile0, s.tile1, s.tile2, s.tile3, s.tile4, s.tile5];

// Subject identity: icon + card colour. Never the mastery colours (DESIGN.md, Mastery Monopoly Rule).
const subjectLook: Record<string, { icon: LucideIcon; tone: string }> = {
    physics: { icon: Atom, tone: s.subGrape },
    chemistry: { icon: FlaskConical, tone: s.subSky },
    biology: { icon: Leaf, tone: s.subLime },
    mathematics: { icon: Sigma, tone: s.subTangerine },
    "further-mathematics": { icon: InfinityIcon, tone: s.subLilac },
};
const fallbackTones = [s.subGrape, s.subSky, s.subLime, s.subTangerine, s.subLilac];

function lookFor(slug: string, index: number) {
    return subjectLook[slug] ?? { icon: BookOpen, tone: fallbackTones[index % fallbackTones.length] };
}

// The skyline behind the hero: a mastery chart rising left to right.
const skyline = [14, 22, 18, 30, 26, 40, 34, 52, 46, 66, 78, 100];

// The headline's last word gets a hand-drawn underline; the text itself is unchanged.
const headline = "Know exactly what to revise next.";
const headLead = headline.slice(0, headline.lastIndexOf(" ") + 1);
const headLast = headline.slice(headLead.length);

async function getStats() {
    const [subjects, topics, questions] = await Promise.all([
        db.subject.findMany({
            where: { isLocal: false },
            orderBy: { order: "asc" },
            select: { slug: true, name: true, _count: { select: { units: true } } },
        }),
        db.topic.count(),
        db.question.count({ where: { status: "PUBLISHED" } }),
    ]);
    return { subjects, topics, questions };
}

export default async function HomePage() {
    const [user, stats] = await Promise.all([getUser(), getStats()]);
    const primaryHref = user ? "/dashboard" : "/sign-up";

    const heroStats = [
        { value: String(stats.topics), label: "specification topics" },
        { value: String(stats.questions), label: "practice questions" },
        { value: "Free", label: "to use" },
    ];

    return (
        <div className={s.page}>
            <a className={s.skip} href="#main">
                Skip to content
            </a>

            <header className={s.heroField}>
                <div className={s.heroBars} aria-hidden="true">
                    {skyline.map((h) => (
                        <span key={h} style={{ "--h": `${h}%` } as CSSProperties} />
                    ))}
                </div>
                <nav className={s.nav} aria-label="Main">
                    <Link className={s.brand} href="/">
                        <LogoMark />
                        <span>{site.name}</span>
                    </Link>
                    <div className={s.navRight}>
                        <Link className={s.navLink} href="/subjects">
                            Subjects
                        </Link>
                        {user ? (
                            <Link className={s.navCta} href="/dashboard">
                                Open app
                            </Link>
                        ) : (
                            <>
                                <Link className={s.navLink} href="/sign-in">
                                    Sign in
                                </Link>
                                <Link className={s.navCta} href="/sign-up">
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className={s.hero}>
                    <h1 className={s.headline}>
                        {headLead}
                        <span className={s.headLast}>
                            {headLast}
                            <svg
                                className={s.swoosh}
                                viewBox="0 0 200 24"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <path d="M4 16 C 50 6, 120 4, 196 12" />
                            </svg>
                        </span>
                    </h1>
                    <div className={s.heroCopy}>
                        <p className={s.subtext}>{site.description}</p>
                        <div className={s.ctas}>
                            <Link href={primaryHref} className={`${s.btn} ${s.btnPrimary} ${s.ctaPrimary}`}>
                                {user ? "Go to today" : "Start practising free"}
                                <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
                            </Link>
                            <Link href="/subjects" className={`${s.btn} ${s.btnSecondary} ${s.ctaGhost}`}>
                                Browse the syllabus
                            </Link>
                        </div>
                    </div>
                    <div className={s.boardWrap}>
                        <MasteryBoard />
                    </div>
                    <div className={s.heroMeta}>
                        <p className={s.audience}>
                            <GraduationCap aria-hidden="true" size={18} strokeWidth={2.5} />
                            Written for Edexcel International A Level
                        </p>
                        <ul className={s.stats} aria-label="At a glance">
                            {heroStats.map((st) => (
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
                            How it works
                        </h2>
                        <ol className={s.steps}>
                            {steps.map((step, i) => (
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
                            Everything revision needs, nothing it doesn&apos;t
                        </h2>
                        <ul className={s.bento}>
                            {features.map(({ title, body, icon: Icon }, i) => {
                                const lead = i === LEAD_FEATURE;
                                return (
                                    <li key={title} className={`${s.tile} ${tileClass[i]} ${lead ? s.tileLead : ""}`}>
                                        <h3 className={s.tileTitle}>
                                            {Icon ? (
                                                <span className={s.tileIcon} aria-hidden="true">
                                                    <Icon size={20} strokeWidth={2.5} />
                                                </span>
                                            ) : null}
                                            {title}
                                        </h3>
                                        <p className={s.tileBody}>{body}</p>
                                        {lead ? <MasteryStrip /> : null}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>

                {stats.subjects.length > 0 && (
                    <section className={s.subjects} aria-labelledby="subjects-title">
                        <div className={s.inner}>
                            <h2 id="subjects-title" className={s.h2}>
                                Subjects
                            </h2>
                            <ul
                                className={s.subjectGrid}
                                style={{ "--cols": Math.min(stats.subjects.length, 5) } as CSSProperties}
                            >
                                {stats.subjects.map((sub, i) => {
                                    const { icon: Icon, tone } = lookFor(sub.slug, i);
                                    const units = sub._count.units;
                                    return (
                                        <li key={sub.slug} className={s.subjectItem}>
                                            <Link className={`${s.subject} ${tone}`} href={`/subjects/${sub.slug}`}>
                                                <span className={s.subjectGlyph} aria-hidden="true">
                                                    <Icon size={32} strokeWidth={2.25} />
                                                </span>
                                                <span className={s.subjectName}>{sub.name}</span>
                                                <span className={s.subjectUnits}>
                                                    <strong>{units}</strong> {units === 1 ? "unit" : "units"}
                                                </span>
                                                <span className={s.pips} aria-hidden="true">
                                                    {Array.from({ length: Math.min(units, 12) }, (_, n) => (
                                                        <span key={n} />
                                                    ))}
                                                </span>
                                                <Icon
                                                    className={s.subjectBig}
                                                    aria-hidden="true"
                                                    size={168}
                                                    strokeWidth={1.75}
                                                />
                                                <ArrowUpRight
                                                    className={s.subjectArrow}
                                                    aria-hidden="true"
                                                    size={24}
                                                    strokeWidth={2.75}
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                )}

                <section className={s.closing} aria-labelledby="closing-title">
                    <div className={s.closingBars} aria-hidden="true">
                        <span className={s.levelWeak} />
                        <span className={s.levelDeveloping} />
                        <span className={s.levelStrong} />
                    </div>
                    <div className={s.closingInner}>
                        <h2 id="closing-title" className={s.closingHeadline}>
                            Your next exam is closer than it looks.
                        </h2>
                        <ul className={s.points}>
                            {["Free to use", "Set up in a minute"].map((p) => (
                                <li key={p}>
                                    <span className={s.pointCheck} aria-hidden="true">
                                        <Check size={16} strokeWidth={3.5} />
                                    </span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                        <Link href={primaryHref} className={`${s.btn} ${s.btnSun}`}>
                            {user ? "Go to today" : "Create your free account"}
                            <ArrowRight aria-hidden="true" size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className={s.footer}>
                <div className={s.footerInner}>
                    <span className={s.footerBrand}>
                        <LogoMark className={s.footerLogo} />
                        {site.name}
                    </span>
                    <p>© {new Date().getFullYear()} Study-IAL</p>
                    <p>Not affiliated with or endorsed by Pearson Edexcel.</p>
                </div>
            </footer>
        </div>
    );
}
