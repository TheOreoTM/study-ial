import type { Metadata } from "next";
import { Alegreya, Castoro, Castoro_Titling } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
import { content } from "@/design-lab/content";
import s from "./page.module.css";

export const metadata: Metadata = { title: "Old Library · Impeccable", robots: { index: false } };

const display = Castoro({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ol-display" });
const titling = Castoro_Titling({ subsets: ["latin"], weight: "400", variable: "--ol-titling" });
const text = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], variable: "--ol-text" });

/** A small gilt finishing tool impression: a lozenge between two dots. Decorative. */
function Tool({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 40 12" aria-hidden="true" focusable="false">
            <circle cx="4" cy="6" r="1.6" />
            <path d="M20 1.2 L25.5 6 L20 10.8 L14.5 6 Z" />
            <circle cx="36" cy="6" r="1.6" />
        </svg>
    );
}

/** A corner fleuron for tooled panels. Decorative. */
function Corner({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M2 2 H14 M2 2 V14" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 6 H12 M6 6 V12" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M14.5 14.5 L17 12 L19.5 14.5 L17 17 Z" fill="currentColor" />
        </svg>
    );
}

/** Splits off the final word so it can be stamped in gilt italic without altering the copy. */
function splitLast(sentence: string) {
    const i = sentence.lastIndexOf(" ");
    return [sentence.slice(0, i + 1), sentence.slice(i + 1)] as const;
}

/** Splits "Exam in 74 days" around its number so the number can be set at display scale. */
function splitNumber(sentence: string) {
    const m = sentence.match(/^(.*?)(\d+)(.*)$/);
    return m ? ([m[1], m[2], m[3]] as const) : ([sentence, "", ""] as const);
}

const bookCloth = {
    strong: "var(--ol-cloth-a)",
    developing: "var(--ol-cloth-b)",
    weak: "var(--ol-oxblood)",
} as const;
const bookLength = ["100%", "93%", "86%", "84%"];
const bookHeight = ["4.5rem", "4.1rem", "4.9rem", "4.35rem"];
const spineCloth = [
    "var(--ol-cloth-a)",
    "var(--ol-cloth-navy)",
    "var(--ol-cloth-c)",
    "var(--ol-cloth-b)",
    "var(--ol-cloth-d)",
];

export default function OldLibraryImpeccablePage() {
    const { nav, hero, stats, masteryExample: ex, howItWorks, features, subjects, closing, footer } = content;
    const [headLead, headLast] = splitLast(hero.headline);
    const [countLead, countNum, countTail] = splitNumber(ex.examCountdown);
    const maxUnits = Math.max(...subjects.items.map((i) => i.units));

    return (
        <div className={`${s.page} ${display.variable} ${titling.variable} ${text.variable}`}>
            <header className={s.masthead}>
                <div className={s.mastInner}>
                    <Link href="/" className={s.brand}>
                        <Tool className={s.brandTool} />
                        {content.brand}
                    </Link>
                    <nav aria-label="Main" className={s.nav}>
                        {nav.links.map((l) => (
                            <Link key={l.href} href={l.href} className={s.navLink}>
                                {l.label}
                            </Link>
                        ))}
                        <Link href={nav.signIn.href} className={s.navLink}>
                            {nav.signIn.label}
                        </Link>
                        <Link href={nav.primary.href} className={`${s.plate} ${s.plateSmall}`}>
                            {nav.primary.label}
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className={s.hero} aria-labelledby="ol-headline">
                    <div className={s.heroCopy}>
                        <h1 id="ol-headline" className={s.headline}>
                            {headLead}
                            <span className={s.headAccent}>{headLast}</span>
                        </h1>
                        <p className={s.subtext}>{hero.subtext}</p>
                        <div className={s.ctas}>
                            <Link href={hero.primaryCta.href} className={s.plate}>
                                {hero.primaryCta.label}
                            </Link>
                            <Link href={hero.secondaryCta.href} className={s.tooled}>
                                {hero.secondaryCta.label}
                            </Link>
                        </div>
                        <p className={s.imprint}>
                            <Tool className={s.imprintTool} />
                            {hero.audience}
                        </p>
                    </div>

                    <figure
                        className={s.bench}
                        aria-label={`Example: ${ex.unitCode} ${ex.unitName}, topics by mastery`}
                    >
                        <figcaption className={s.volume}>
                            <span id="ol-unit" className={s.volumeTitle}>
                                <span className={s.unitCode}>{ex.unitCode}</span>
                                <span className={s.unitName}>{ex.unitName}</span>
                            </span>
                            <span className={s.countdown}>
                                {countLead}
                                <span className={s.countNum}>{countNum}</span>
                                {countTail}
                            </span>
                        </figcaption>

                        <ol className={s.stack}>
                            {ex.topics.map((t, i) => {
                                const next = "isNext" in t && t.isNext;
                                return (
                                    <li
                                        key={t.code}
                                        className={`${s.book} ${next ? s.bookNext : ""}`}
                                        data-level={t.level}
                                        style={
                                            {
                                                "--book-cloth": bookCloth[t.level],
                                                "--book-length": bookLength[i],
                                                "--book-height": bookHeight[i],
                                                "--score": `${t.score}%`,
                                            } as CSSProperties
                                        }
                                    >
                                        <span className={s.bookCode}>{t.code}</span>
                                        <span className={s.bookLabel}>
                                            <span className={s.bookName}>{t.name}</span>
                                            <span className={s.gauge} aria-hidden="true">
                                                <span className={s.gaugeFill} />
                                            </span>
                                        </span>
                                        <span className={s.bookScore}>
                                            <span className={s.pct}>{t.score}%</span>
                                            <span className={s.level}>{t.level}</span>
                                        </span>
                                        {next ? <span className={s.ribbon} aria-hidden="true" /> : null}
                                    </li>
                                );
                            })}
                        </ol>

                        <div className={s.shelf}>
                            <p className={s.holder}>{ex.nextUp}</p>
                        </div>
                    </figure>
                </section>

                <section className={s.bands} aria-label="At a glance">
                    <ul className={s.bandList}>
                        {stats.map((st) => (
                            <li key={st.label} className={s.bandItem}>
                                <span className={s.bandValue}>{st.value}</span>
                                <span className={s.bandLabel}>{st.label}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={s.chapters} aria-labelledby="ol-how">
                    <h2 id="ol-how" className={s.sectionTitle}>
                        {howItWorks.heading}
                    </h2>
                    <ol className={s.chapterList}>
                        {howItWorks.steps.map((st) => (
                            <li key={st.title} className={s.chapter}>
                                <span className={s.numeral} aria-hidden="true" />
                                <h3 className={s.chapterTitle}>{st.title}</h3>
                                <p className={s.chapterBody}>{st.body}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={s.index} aria-labelledby="ol-features">
                    <h2 id="ol-features" className={s.indexTitle}>
                        {features.heading}
                    </h2>
                    <dl className={s.indexList}>
                        {features.items.map((f) => (
                            <div key={f.title} className={s.entry}>
                                <dt className={s.entryTitle}>{f.title}</dt>
                                <dd className={s.entryBody}>{f.body}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section className={s.shelfSection} aria-labelledby="ol-subjects">
                    <h2 id="ol-subjects" className={s.sectionTitle}>
                        {subjects.heading}
                    </h2>
                    <div className={s.shelfBody}>
                        <ul className={s.spines}>
                            {subjects.items.map((sub, i) => (
                                <li
                                    key={sub.href}
                                    className={s.spineSlot}
                                    style={
                                        {
                                            "--spine-cloth": spineCloth[i],
                                            "--spine-h": `${62 + (sub.units / maxUnits) * 38}%`,
                                        } as CSSProperties
                                    }
                                >
                                    <Link href={sub.href} className={s.spine}>
                                        <span className={s.spineBands} aria-hidden="true" />
                                        <span className={s.spineName}>{sub.name}</span>
                                        <span className={s.spineLabel}>{sub.units} units</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className={s.shelfRail} aria-hidden="true" />
                    </div>
                </section>

                <section className={s.closing} aria-labelledby="ol-closing">
                    <div className={s.panel}>
                        <Corner className={`${s.corner} ${s.cTL}`} />
                        <Corner className={`${s.corner} ${s.cTR}`} />
                        <Corner className={`${s.corner} ${s.cBL}`} />
                        <Corner className={`${s.corner} ${s.cBR}`} />
                        <h2 id="ol-closing" className={s.closingTitle}>
                            {closing.headline}
                        </h2>
                        <ul className={s.points}>
                            {closing.points.map((p) => (
                                <li key={p}>
                                    <Tool className={s.pointTool} />
                                    {p}
                                </li>
                            ))}
                        </ul>
                        <Link href={closing.cta.href} className={s.plate}>
                            {closing.cta.label}
                        </Link>
                    </div>
                </section>
            </main>

            <footer className={s.footer}>
                <span className={s.footBrand}>{content.brand}</span>
                <span>{footer.copyright}</span>
                <span>{footer.disclaimer}</span>
            </footer>
        </div>
    );
}
