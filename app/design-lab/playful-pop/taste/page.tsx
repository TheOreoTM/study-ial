import { Fredoka, Nunito } from "next/font/google";
import Link from "next/link";

import { content } from "@/design-lab/content";

import { Atoll, FocusTimer, ManyIntoOne, Marking, MasteryBars, PlanWeek, TopicStack } from "./drawings";
import s from "./page.module.css";
import { Reveal } from "./reveal";

export const metadata = { title: "Playful Pop · Taste", robots: { index: false } };

const display = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--pp-display" });
const text = Nunito({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--pp-text" });

const IMG = "/design-lab/playful-pop-taste";

const SUBJECT_ART = [
    { file: "iron-filings.jpg", alt: "Iron filings tracing the magnetic field around a magnet", tone: s.sun },
    { file: "lab-glass.jpg", alt: "Laboratory glassware laid out on a white bench", tone: s.coral },
    { file: "botanical.jpg", alt: "Nineteenth-century botanical plate of a flowering shrub", tone: s.leaf },
    { file: "staircase.jpg", alt: "Engraved geometry construction of a curved staircase", tone: s.sky },
    { file: "earth-geometry.jpg", alt: "Old atlas page of earth geometry with circles and projections", tone: s.pink },
];

const FEATURE_ART = [
    { Art: TopicStack, tone: s.sky },
    { Art: MasteryBars, tone: s.sun, wide: true },
    { Art: PlanWeek, tone: s.leaf },
    { Art: Marking, tone: s.coral },
    { Art: FocusTimer, tone: s.pink },
    { Art: Atoll, tone: s.lagoon, wide: true },
];

const CREDITS = [
    { label: "Iron filings", by: "", lic: "CC BY-SA 2.0", href: "https://commons.wikimedia.org/wiki/File:Iron-filings-around-magnet.jpg" },
    { label: "Laboratory glass", by: "Hannes Grobe", lic: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Laboratory-glas_hg.jpg" },
    { label: "Curtis's Botanical Magazine, plate 3113", by: "", lic: "public domain", href: "https://commons.wikimedia.org/wiki/File:Curtis%27s_botanical_magazine_(Plate_3113)_(8411514810).jpg" },
    { label: "Geometry of a curved staircase", by: "Wellcome Collection", lic: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Architecture;_the_geometry_of_a_curved_staircase._Engraving_Wellcome_V0024286.jpg" },
    { label: "Earth Geometry", by: "Vincenzo Coronelli", lic: "public domain", href: "https://commons.wikimedia.org/wiki/File:Earth_Geometry._(IA_dr_earth-geometry-12186019).jpg" },
    { label: "Malé", by: "Shahee Ilyas", lic: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Male-total.jpg" },
    { label: "Students studying", by: "Gary Todd", lic: "CC0", href: "https://commons.wikimedia.org/wiki/File:Sias_Library_-_Students_Studying_2017.jpg" },
];

const levelClass = { strong: s.strong, developing: s.developing, weak: s.weak } as const;

export default function PlayfulPopTaste() {
    const { nav, hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer } = content;
    const tileTone = [s.tileBig, s.tileInk, s.tileSun];

    return (
        <div className={`${s.page} ${display.variable} ${text.variable}`} data-pp-root>
            <Reveal armed={s.armed} shown={s.in} targets={[s.rise, s.tile, s.row, s.markPill]} />
            <header className={s.nav}>
                <Link className={s.brand} href="/" aria-label={`${content.brand} home`}>
                    <span className={s.brandPill} aria-hidden="true" />
                    {content.brand}
                </Link>
                <nav className={s.navLinks} aria-label="Main">
                    {nav.links.map((l) => (
                        <a key={l.href} className={s.navLink} href={l.href}>
                            {l.label}
                        </a>
                    ))}
                    <a className={s.navLink} href={nav.signIn.href}>
                        {nav.signIn.label}
                    </a>
                    <a className={`${s.btn} ${s.btnSmall}`} href={nav.primary.href}>
                        {nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="main">
                {/* Hero: the mastery bar's pill, at enormous scale, carries the product itself. */}
                <section className={s.hero} aria-labelledby="hero-title">
                    <div className={s.heroGrid}>
                        <div className={s.heroCopy}>
                            <h1 id="hero-title" className={`${s.h1} ${s.load}`}>
                                {hero.headline}
                            </h1>
                            <p className={`${s.lead} ${s.load} ${s.d1}`}>{hero.subtext}</p>
                            <div className={`${s.ctas} ${s.load} ${s.d2}`}>
                                <a className={s.btn} href={hero.primaryCta.href}>
                                    {hero.primaryCta.label}
                                </a>
                                <a className={`${s.btn} ${s.btnQuiet}`} href={hero.secondaryCta.href}>
                                    {hero.secondaryCta.label}
                                </a>
                            </div>
                            <p className={`${s.audience} ${s.load} ${s.d3}`}>
                                <span className={s.dot} aria-hidden="true" />
                                {hero.audience}
                            </p>
                        </div>

                        <div className={s.giant} data-ui>
                            <div className={s.panel}>
                                <div className={s.unitRow}>
                                    <p className={s.unit}>
                                        <strong>{m.unitCode}</strong> {m.unitName}
                                    </p>
                                    <p className={s.countdown}>{m.examCountdown}</p>
                                </div>
                                <ul className={s.bars}>
                                    {m.topics.map((t, i) => {
                                        const next = "isNext" in t && t.isNext;
                                        return (
                                            <li key={t.code} className={`${s.barRow} ${next ? s.isNext : ""}`}>
                                                <p className={s.barLabel}>
                                                    <span>
                                                        <span className={s.code}>{t.code}</span> {t.name}
                                                    </span>
                                                    <span className={s.pct}>{t.score}%</span>
                                                </p>
                                                <span className={s.track} aria-hidden="true">
                                                    <span
                                                        className={`${s.fill} ${levelClass[t.level]}`}
                                                        style={{ width: `${t.score}%`, animationDelay: `${300 + i * 110}ms` }}
                                                    />
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <p className={s.nextUp}>
                                    <span className={s.nextDot} aria-hidden="true" />
                                    {m.nextUp}
                                </p>
                            </div>
                        </div>
                    </div>

                    <ul className={s.stats}>
                        {stats.map((st, i) => (
                            <li key={st.label} className={`${s.tile} ${tileTone[i]}`}>
                                <span className={s.figure}>{st.value}</span>
                                <span className={s.tileLabel}>{st.label}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* How it works: many loose questions, squeezed through a topic, ordered into mastery. */}
                <section className={s.how} aria-labelledby="how-title">
                    <div className={s.howTop}>
                        <h2 id="how-title" className={`${s.h2} ${s.rise}`}>
                            {howItWorks.heading}
                        </h2>
                        <img
                            className={`${s.howPhoto} ${s.rise} ${s.r2}`}
                            src={`${IMG}/students.jpg`}
                            width={1200}
                            height={800}
                            alt="Students revising at long tables in a university library"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <div className={`${s.diagram} ${s.rise} ${s.r1}`}>
                        <div className={s.diagramWide}>
                            <ManyIntoOne />
                        </div>
                        <div className={s.diagramTall}>
                            <ManyIntoOne vertical />
                        </div>
                        <ol className={s.steps}>
                            {howItWorks.steps.map((st, i) => (
                                <li key={st.title} className={`${s.step} ${s.rise} ${[s.r1, s.r2, s.r3][i]}`}>
                                    <h3 className={s.h3}>{st.title}</h3>
                                    <p>{st.body}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Features: specimens drawn from the pill, on colour tiles. */}
                <section className={s.features} aria-labelledby="features-title">
                    <h2 id="features-title" className={`${s.h2} ${s.featuresTitle} ${s.rise}`}>
                        {features.heading}
                    </h2>
                    <ul className={s.specimens}>
                        {features.items.map((f, i) => {
                            const { Art, tone, wide } = FEATURE_ART[i];
                            return (
                                <li key={f.title} className={`${s.specimen} ${wide ? s.wide : ""} ${s.rise} ${[s.r1, s.r2, s.r3][i % 3]}`}>
                                    <div className={`${s.specTile} ${tone}`}>
                                        <Art />
                                    </div>
                                    <h3 className={s.h3}>{f.title}</h3>
                                    <p>{f.body}</p>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                {/* Subjects: an index; pointing at a row brings its picture into the pill frame. */}
                <section className={s.subjects} aria-labelledby="subjects-title">
                    <h2 id="subjects-title" className={`${s.h2} ${s.rise}`}>
                        {subjects.heading}
                    </h2>
                    <div className={s.index}>
                        <ul className={s.rows}>
                            {subjects.items.map((sub, i) => (
                                <li key={sub.href} className={`${s.row} ${SUBJECT_ART[i].tone}`}>
                                    <a href={sub.href} className={s.rowLink}>
                                        <span className={s.thumb} aria-hidden="true">
                                            <img src={`${IMG}/${SUBJECT_ART[i].file}`} alt="" width={120} height={160} loading="lazy" />
                                        </span>
                                        <span className={s.rowName}>{sub.name}</span>
                                        <span className={s.rowUnits}>{sub.units} units</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className={s.preview}>
                            {SUBJECT_ART.map((a, i) => (
                                <figure key={a.file} className={`${s.frame} ${a.tone}`} data-i={i}>
                                    <img src={`${IMG}/${a.file}`} alt={a.alt} width={1200} height={1500} loading="lazy" decoding="async" />
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing: the pill returns, now holding the island the students live on. */}
                <section className={s.closing} aria-labelledby="closing-title">
                    <div className={s.closingPic}>
                        <img
                            src={`${IMG}/male-total.jpg`}
                            width={1200}
                            height={800}
                            alt="Aerial view of Malé, the capital island of the Maldives, ringed by reef"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <div className={s.closingText}>
                        <h2 id="closing-title" className={`${s.h2} ${s.rise}`}>
                            {closing.headline}
                        </h2>
                        <ul className={`${s.points} ${s.rise} ${s.r1}`}>
                            {closing.points.map((p) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                        <a className={`${s.btn} ${s.btnInk} ${s.rise} ${s.r2}`} href={closing.cta.href}>
                            {closing.cta.label}
                        </a>
                    </div>
                </section>
            </main>

            <footer className={s.footer}>
                <p className={s.mark}>
                    {content.brand.split("").map((ch, i) => (
                        <span key={i} className={s.markPill} style={{ ["--h" as string]: `${[86, 64, 100, 72, 92, 40, 78, 100, 68][i] ?? 80}%` }}>
                            {ch}
                        </span>
                    ))}
                </p>
                <div className={s.footRow}>
                    <p>{footer.copyright}</p>
                    <p>{footer.disclaimer}</p>
                </div>
                <p className={s.credits}>
                    Pictures via Wikimedia Commons:{" "}
                    {CREDITS.map((c, i) => (
                        <span key={c.href}>
                            <a href={c.href}>{c.label}</a>
                            {c.by ? `, ${c.by}` : ""} ({c.lic}){i < CREDITS.length - 1 ? "; " : "."}
                        </span>
                    ))}
                </p>
            </footer>
        </div>
    );
}
