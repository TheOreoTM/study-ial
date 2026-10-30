import { Albert_Sans } from "next/font/google";
import { content } from "@/design-lab/content";
import { Reveal } from "./reveal";
import { SubjectShowcase } from "./subject-showcase";
import s from "./night-desk.module.css";

export const metadata = { title: "Night Desk · Taste", robots: { index: false } };

const albert = Albert_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

const c = content;
const IMG = "/design-lab/night-desk-taste";

// ---------- drawings made from the one motif: the circle of lamplight ----------

function seeded(seed: number) {
    let x = seed;
    return () => {
        x = (x * 1664525 + 1013904223) % 4294967296;
        return x / 4294967296;
    };
}

type Dot = { x: number; y: number; t: 0 | 1 | 2 };

// Scattered topics, squeezed into practice, released as ordered mastery. 149 dots, no arrows.
function diagramDots(): Dot[] {
    const r = seeded(11);
    const dots: Dot[] = [];
    for (let i = 0; i < 50; i++) {
        const x = 12 + r() * 380;
        const spread = 118 * (1 - x / 560);
        dots.push({ x, y: 135 + (r() * 2 - 1) * spread, t: r() > 0.5 ? 0 : 1 });
    }
    for (let col = 0; col < 15; col++)
        for (let row = 0; row < 3; row++) dots.push({ x: 432 + col * 24, y: 121 + row * 14, t: 1 });
    for (let col = 0; col < 9; col++)
        for (let row = 0; row < 6; row++) dots.push({ x: 834 + col * 44, y: 35 + row * 40, t: 2 });
    return dots;
}

function Diagram({ vertical }: { vertical?: boolean }) {
    const dots = diagramDots();
    return (
        <svg
            className={vertical ? s.diagramV : s.diagramH}
            viewBox={vertical ? "0 0 270 1200" : "0 0 1200 270"}
            aria-hidden="true"
            focusable="false"
        >
            {dots.map((d, i) => (
                <circle
                    key={i}
                    cx={vertical ? d.y : d.x}
                    cy={vertical ? d.x : d.y}
                    r={6.5}
                    className={d.t === 0 ? s.dotA : d.t === 1 ? s.dotB : s.dotC}
                />
            ))}
        </svg>
    );
}

// Mastery ring: the same circle, filled to the topic's score.
function Ring({ score, level }: { score: number; level: string }) {
    const R = 15;
    const L = 2 * Math.PI * R;
    return (
        <svg className={s.ring} viewBox="0 0 40 40" aria-hidden="true" focusable="false" data-level={level}>
            <circle cx="20" cy="20" r={R} className={s.ringTrack} />
            <circle
                cx="20"
                cy="20"
                r={R}
                className={s.ringFill}
                strokeDasharray={`${(score / 100) * L} ${L}`}
                transform="rotate(-90 20 20)"
            />
        </svg>
    );
}

// The footer mark: each letter knocked out of its own disc, discs of different sizes on one baseline.
function Mark({ text, width, sizes }: { text: string; width: number; sizes: number[] }) {
    const gap = 4;
    const total = sizes.reduce((a, b) => a + b, 0);
    const k = (width - gap * (sizes.length - 1)) / total;
    const ds = sizes.map((v) => v * k);
    const h = Math.max(...ds);
    const centres = ds.map((d, i) => ds.slice(0, i).reduce((a, v) => a + v + gap, 0) + d / 2);
    return (
        <svg viewBox={`0 0 ${width} ${h}`} aria-hidden="true" focusable="false" className={s.markSvg}>
            {text.split("").map((ch, i) => {
                const d = ds[i];
                const cx = centres[i];
                return (
                    <g key={i} className={s[`markDisc${i % 4}`]}>
                        <circle cx={cx} cy={h - d / 2} r={d / 2} />
                        <text x={cx} y={h - d / 2} dy="0.35em" textAnchor="middle" fontSize={d * 0.6}>
                            {ch}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

// Enlarged interface parts for the feature board.
const featureVisual: Record<string, React.ReactNode> = {
    "Topic-level practice": (
        <div className={`${s.ui} ${s.uiOptions}`} data-ui aria-hidden="true">
            {["A", "B", "C", "D"].map((l) => (
                <span key={l} className={s.uiOption} data-on={l === "C" ? "" : undefined}>
                    {l}
                </span>
            ))}
        </div>
    ),
    "Mastery you can see": (
        <div className={`${s.ui} ${s.uiBigRing}`} data-ui aria-hidden="true">
            <Ring score={86} level="strong" />
            <span>86%</span>
        </div>
    ),
    "Plans that adapt": (
        <div className={`${s.ui} ${s.uiDays}`} data-ui aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
                <span key={i} data-state={i < 9 ? "done" : i === 9 ? "today" : "todo"} />
            ))}
        </div>
    ),
    "Instant marking": (
        <div className={`${s.ui} ${s.uiTick}`} data-ui aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
                <circle cx="50" cy="50" r="48" />
                <path d="M28 52 L44 67 L73 36" />
            </svg>
        </div>
    ),
    "Focus timer": (
        <div className={`${s.ui} ${s.uiTimer}`} data-ui aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
                <circle cx="50" cy="50" r="40" className={s.timerTrack} />
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={s.timerArc}
                    strokeDasharray={`${0.72 * 2 * Math.PI * 40} 999`}
                    transform="rotate(-90 50 50)"
                />
                <circle cx="50" cy="50" r="7" className={s.timerKnob} />
            </svg>
        </div>
    ),
    "Built for IAL": (
        <div className={`${s.ui} ${s.uiCode}`} data-ui aria-hidden="true">
            {c.masteryExample.unitCode}
        </div>
    ),
};

const featureSlot = ["fA", "fB", "fC", "fD", "fE", "fF"] as const;

export default function NightDeskTastePage() {
    const m = c.masteryExample;
    return (
        <div id="nd-root" className={`${s.root} ${albert.className}`}>
            <style>{`body{background:#1c1410;color:#ece8e3}`}</style>
            <Reveal rootId="nd-root" />

            {/* ---------- navigation ---------- */}
            <header className={s.nav}>
                <a href="#top" className={s.wordmark} aria-label={`${c.brand} home`}>
                    <span className={s.wordmarkDot} aria-hidden="true" />
                    {c.brand}
                </a>
                <nav aria-label="Main" className={s.navLinks}>
                    {c.nav.links.map((l) => (
                        <a key={l.href} href={l.href} className={s.navLink}>
                            {l.label}
                        </a>
                    ))}
                    <a href={c.nav.signIn.href} className={s.navLink}>
                        {c.nav.signIn.label}
                    </a>
                    <a href={c.nav.primary.href} className={`${s.btn} ${s.btnSmall}`}>
                        {c.nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="main">
                {/* ---------- hero: the panel on the lamp's pool of light ---------- */}
                <section className={s.hero} id="top" aria-labelledby="hero-title">
                    <div className={s.heroLight} aria-hidden="true" />
                    <div className={s.heroText}>
                        <h1 id="hero-title" className={s.heroTitle} data-rise="0">
                            {c.hero.headline}
                        </h1>
                        <p className={s.heroSub} data-rise="1">
                            {c.hero.subtext}
                        </p>
                        <div className={s.heroActions} data-rise="2">
                            <a href={c.hero.primaryCta.href} className={s.btn}>
                                {c.hero.primaryCta.label}
                            </a>
                            <a href={c.hero.secondaryCta.href} className={s.textLink}>
                                {c.hero.secondaryCta.label}
                            </a>
                        </div>
                    </div>
                    <div className={s.heroStage}>
                        <div className={s.stageLight} aria-hidden="true" />
                        <article className={s.panel} data-ui data-rise="3" aria-label={`${m.unitCode} mastery example`}>
                            <header className={s.panelHead}>
                                <div>
                                    <p className={s.panelCode}>{m.unitCode}</p>
                                    <p className={s.panelUnit}>{m.unitName}</p>
                                </div>
                                <p className={s.panelCountdown}>{m.examCountdown}</p>
                            </header>
                            <ul className={s.topics}>
                                {m.topics.map((t) => (
                                    <li key={t.code} className={s.topic} data-next={"isNext" in t ? "" : undefined}>
                                        <span className={s.topicCode}>{t.code}</span>
                                        <span className={s.topicName}>{t.name}</span>
                                        <span className={s.topicScore}>
                                            <Ring score={t.score} level={t.level} />
                                            <span className={s.topicPct}>{t.score}%</span>
                                        </span>
                                        <span className={s.topicLevel} data-level={t.level}>
                                            {t.level}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className={s.nextUp}>
                                <span className={s.nextDot} aria-hidden="true" />
                                {m.nextUp}
                            </p>
                        </article>
                    </div>
                </section>

                {/* ---------- stats: stepped tiles ---------- */}
                <section className={s.stats} aria-labelledby="stats-title">
                    <h2 id="stats-title" className={s.statsTitle} data-rise="0">
                        {c.hero.audience}
                    </h2>
                    {c.stats.map((st, i) => (
                        <div key={st.label} className={`${s.statTile} ${s[`stat${i}`]}`} data-rise={String(i + 1)}>
                            <p className={s.statValue}>{st.value}</p>
                            <p className={s.statLabel}>{st.label}</p>
                        </div>
                    ))}
                </section>

                {/* ---------- how it works: many into one ---------- */}
                <section className={s.how} aria-labelledby="how-title">
                    <h2 id="how-title" className={s.sectionTitle} data-rise="0">
                        {c.howItWorks.heading}
                    </h2>
                    <div className={s.howBody}>
                        <div className={s.howFigure} data-rise="1">
                            <Diagram />
                            <Diagram vertical />
                        </div>
                        <ol className={s.howSteps}>
                            {c.howItWorks.steps.map((st, i) => (
                                <li key={st.title} data-rise={String(i + 1)}>
                                    <h3 className={s.stepTitle}>{st.title}</h3>
                                    <p>{st.body}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* ---------- features: close-ups on a board ---------- */}
                <section className={s.features} aria-labelledby="features-title">
                    <div className={s.board}>
                        <div className={`${s.tile} ${s.tileHeading}`} data-rise="0">
                            <h2 id="features-title" className={s.sectionTitle}>
                                {c.features.heading}
                            </h2>
                        </div>
                        {c.features.items.map((f, i) => (
                            <div
                                key={f.title}
                                className={`${s.tile} ${s[featureSlot[i]]}`}
                                data-rise={String((i % 3) + 1)}
                            >
                                {featureVisual[f.title]}
                                <div className={s.tileCaption}>
                                    <h3 className={s.tileTitle}>{f.title}</h3>
                                    <p>{f.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ---------- subjects: the picture in the circle (live) ---------- */}
                <section className={s.subjects} aria-labelledby="subjects">
                    <SubjectShowcase heading={c.subjects.heading} items={c.subjects.items} />
                </section>

                {/* ---------- closing: the real lamp ---------- */}
                <section className={s.closing} aria-labelledby="closing-title">
                    <div className={s.closingPhoto}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${IMG}/lamp.jpg`}
                            alt="A bulb lamp glowing on a desk at night"
                            width={1920}
                            height={1600}
                            loading="lazy"
                        />
                    </div>
                    <div className={s.closingText}>
                        <h2 id="closing-title" className={s.closingTitle} data-rise="0">
                            {c.closing.headline}
                        </h2>
                        <ul className={s.closingPoints} data-rise="1">
                            {c.closing.points.map((p) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                        <a href={c.closing.cta.href} className={`${s.btn} ${s.btnPaper}`} data-rise="2">
                            {c.closing.cta.label}
                        </a>
                    </div>
                </section>
            </main>

            {/* ---------- footer: the mark, built from discs ---------- */}
            <footer className={s.footer}>
                <div className={s.mark} role="img" aria-label={c.brand}>
                    <div className={s.markWide}>
                        <Mark text={c.brand} width={1360} sizes={[100, 74, 78, 92, 80, 46, 70, 96, 84]} />
                    </div>
                    <div className={s.markNarrow}>
                        <Mark text="Study-" width={600} sizes={[100, 74, 78, 92, 80, 46]} />
                        <Mark text="IAL" width={600} sizes={[70, 96, 84]} />
                    </div>
                </div>
                <div className={s.footRow}>
                    <nav aria-label="Footer" className={s.footLinks}>
                        {c.nav.links.map((l) => (
                            <a key={l.href} href={l.href}>
                                {l.label}
                            </a>
                        ))}
                        <a href={c.nav.signIn.href}>{c.nav.signIn.label}</a>
                    </nav>
                    <p className={s.footDisclaimer}>{c.footer.disclaimer}</p>
                </div>
                <div className={s.footLast}>
                    <p>{c.footer.copyright}</p>
                    <a href={c.nav.primary.href} className={`${s.btn} ${s.btnSmall}`}>
                        {c.nav.primary.label}
                    </a>
                </div>
                <p className={s.credits}>
                    Pictures: Newtons Cradle by The Dean of Physics (CC BY-SA 4.0); chemical laboratory engraving, 1778,
                    Wellcome Collection (CC BY 4.0); Micrographia by Robert Hooke, 1665 (public domain); Geometria by
                    the Master of the E-Series Tarocchi (CC0, NGA); slide rule by Jacek Halicki (CC BY-SA 4.0); bulb
                    lamp by Sihyeon0621 (CC BY-SA 4.0). All via Wikimedia Commons.
                </p>
            </footer>
        </div>
    );
}
