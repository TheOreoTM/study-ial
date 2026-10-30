import { Figtree, Zen_Kaku_Gothic_New } from "next/font/google";
import { content } from "@/design-lab/content";
import { MasteryShowcase, Reveal, Ring, StepsAccordion } from "./interactive";
import styles from "./page.module.css";

export const metadata = { title: "Soft Minimal · Taste", robots: { index: false } };

const display = Zen_Kaku_Gothic_New({
    weight: ["500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--sm-display",
});

const text = Figtree({
    weight: ["400", "600"],
    subsets: ["latin"],
    display: "swap",
    variable: "--sm-text",
});

const PIC = "/design-lab/soft-minimal-taste";

const SUBJECT_PICTURES: Record<string, { src: string; alt: string }> = {
    Physics: { src: `${PIC}/pendulum-chase-bohannon.jpg`, alt: "A brass pendulum bob" },
    Chemistry: { src: `${PIC}/volumetric-flask-string1.jpg`, alt: "The neck of a volumetric flask tied with string" },
    Biology: { src: `${PIC}/botanical-plate.jpg`, alt: "An 18th-century porcelain plate painted with plants" },
    Mathematics: {
        src: `${PIC}/woman-teaching-geometry.jpg`,
        alt: "Medieval illumination of a woman teaching geometry with compasses",
    },
    "Further Mathematics": { src: `${PIC}/astrolabe.jpg`, alt: "A brass Qajar astrolabe" },
};

const CREDITS = [
    ["Baa atoll islands", "Frédéric Ducarme", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Baa_atoll_islands.JPG"],
    [
        "Guriadhoo 2019 aerial view",
        "Luka Peternel",
        "CC BY-SA 4.0",
        "https://commons.wikimedia.org/wiki/File:Guriadhoo-2019-aerial-view-Luka-Peternel.jpg",
    ],
    ["Ari Atoll passes", "Bruno de Giusti", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Ari_Atoll_passes.jpg"],
    ["Male-total", "Shahee Ilyas", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Male-total.jpg"],
    [
        "Flora of Male islands, Maldives 04",
        "Rajasekhar1961",
        "CC0",
        "https://commons.wikimedia.org/wiki/File:Flora_of_Male_islands,_Maldives_04.jpg",
    ],
    [
        "Eurêka - Archimède",
        "Mazzucchelli, Scalvini, Orsolini",
        "public domain",
        "https://commons.wikimedia.org/wiki/File:Eur%C3%AAka_-_Archim%C3%A8de.jpg",
    ],
    [
        "Pendulum",
        "Chase Bohannon",
        "CC0",
        "https://commons.wikimedia.org/wiki/File:Pendulum_(Chase_Bohannon).jpg",
    ],
    [
        "Volumetric flask string1",
        "Akaniji",
        "public domain",
        "https://commons.wikimedia.org/wiki/File:Volumetric_flask_string1.jpg",
    ],
    ["Botanical Plate", "Chelsea Porcelain Factory", "CC0", "https://www.artic.edu/artworks/276654"],
    [
        "Woman teaching geometry",
        "attributed to the Meliacin Master",
        "public domain",
        "https://commons.wikimedia.org/wiki/File:Woman_teaching_geometry.jpg",
    ],
    ["Astrolabe", "Qajar dynasty, Art Institute of Chicago", "CC0", "https://www.artic.edu/artworks/90589"],
] as const;

export default function SoftMinimalTastePage() {
    const { nav, hero, stats, masteryExample, howItWorks, features, subjects, closing, footer } = content;

    return (
        <div className={`${styles.page} ${display.variable} ${text.variable}`}>
            <Reveal />
            <header className={styles.bar}>
                <a href="#top" className={styles.wordmark}>
                    <span className={styles.markDot} aria-hidden="true" />
                    {content.brand}
                </a>
                <nav className={styles.barNav} aria-label="Main">
                    {nav.links.map((l) => (
                        <a key={l.href} href={l.href} className={styles.barLink}>
                            {l.label}
                        </a>
                    ))}
                    <a href={nav.signIn.href} className={styles.barLink}>
                        {nav.signIn.label}
                    </a>
                    <a href={nav.primary.href} className={`${styles.button} ${styles.buttonSmall}`}>
                        {nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="top">
                {/* Hero: one reef ring at enormous scale, cropped by the screen. */}
                <section className={styles.hero} aria-labelledby="hero-title">
                    <div className={styles.heroText}>
                        <h1 id="hero-title" className={styles.display}>
                            {hero.headline}
                        </h1>
                        <p className={styles.lead}>{hero.subtext}</p>
                        <div className={styles.actions}>
                            <a href={hero.primaryCta.href} className={styles.button}>
                                {hero.primaryCta.label}
                            </a>
                            <a href={hero.secondaryCta.href} className={styles.quietLink}>
                                {hero.secondaryCta.label}
                            </a>
                        </div>
                        <p className={styles.audience}>
                            <span className={styles.inlineDot} aria-hidden="true" />
                            {hero.audience}
                        </p>
                    </div>
                    <figure className={styles.heroDisc}>
                        <div className={styles.heroShutter}>
                            <img
                                className={`${styles.photo} ${styles.heroPhoto}`}
                                src={`${PIC}/baa-atoll-islands.jpg`}
                                width={1920}
                                height={1440}
                                alt="Ring-shaped reefs and lagoons of Baa Atoll, Maldives, seen from the air"
                                fetchPriority="high"
                            />
                        </div>
                    </figure>
                </section>

                {/* The band that separates the two halves: the numbers. */}
                <div className={styles.statsBand}>
                    <dl className={styles.stats}>
                        {stats.map((s) => (
                            <div key={s.label} className={`${styles.stat} ${styles.rise}`}>
                                <dt className={styles.statLabel}>{s.label}</dt>
                                <dd className={styles.statValue}>{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Showcase: the mastery ring laid over a real reef ring. */}
                <section className={styles.showcase} aria-labelledby="mastery-title">
                    <MasteryShowcase data={masteryExample} headingId="mastery-title" />
                </section>

                <section className={styles.how} aria-labelledby="how-title">
                    <div className={styles.howIntro}>
                        <h2 id="how-title" className={`${styles.head} ${styles.rise}`}>
                            {howItWorks.heading}
                        </h2>
                    </div>
                    <StepsAccordion steps={howItWorks.steps} />
                </section>

                <section className={styles.features} aria-labelledby="features-title">
                    <figure className={`${styles.featuresDisc} ${styles.rise}`}>
                        <img
                            className={styles.photo}
                            src={`${PIC}/flora-of-male-islands-maldives-04.jpg`}
                            width={1920}
                            height={1080}
                            alt="Palms and shade trees on a quiet path in Malé"
                            loading="lazy"
                            decoding="async"
                        />
                    </figure>
                    <div className={styles.featuresText}>
                        <h2 id="features-title" className={`${styles.head} ${styles.rise}`}>
                            {features.heading}
                        </h2>
                        <ul className={styles.points}>
                            {features.items.map((f, i) => (
                                <li key={f.title} className={`${styles.point} ${styles.rise}`}>
                                    <h3 className={styles.pointTitle}>
                                        <span
                                            className={`${styles.pointDot} ${styles[`dot${i % 3}`]}`}
                                            aria-hidden="true"
                                        />
                                        {f.title}
                                    </h3>
                                    <p className={styles.pointBody}>{f.body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className={styles.subjects} aria-labelledby="subjects-title">
                    <h2 id="subjects-title" className={`${styles.head} ${styles.rise}`}>
                        {subjects.heading}
                    </h2>
                    <ul className={styles.subjectList}>
                        {subjects.items.map((s) => {
                            const pic = SUBJECT_PICTURES[s.name];
                            return (
                                <li key={s.href} className={styles.rise}>
                                    <a href={s.href} className={styles.subjectRow}>
                                        <span className={styles.subjectThumb}>
                                            <img
                                                className={styles.photo}
                                                src={pic.src}
                                                width={160}
                                                height={160}
                                                alt={pic.alt}
                                                decoding="async"
                                            />
                                        </span>
                                        <span className={styles.subjectName}>{s.name}</span>
                                        <span className={styles.subjectUnits}>{s.units} units</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className={styles.closing} aria-labelledby="closing-title">
                    <h2 id="closing-title" className={`${styles.head} ${styles.rise}`}>
                        {closing.headline}
                    </h2>
                    <ul className={`${styles.closingPoints} ${styles.rise}`}>
                        {closing.points.map((p) => (
                            <li key={p}>
                                <span className={styles.inlineDot} aria-hidden="true" />
                                {p}
                            </li>
                        ))}
                    </ul>
                    <a href={closing.cta.href} className={`${styles.closingLink} ${styles.rise}`}>
                        <span>{closing.cta.label}</span>
                        <svg className={styles.arrow} viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M14 34 L34 14 M18 14 H34 V30" />
                        </svg>
                    </a>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerRings} aria-hidden="true">
                    {masteryExample.topics.map((t) => (
                        <Ring key={t.code} score={t.score} className={styles.footerRing} />
                    ))}
                </div>
                <p className={styles.footerBrand}>{content.brand}</p>
                <div className={styles.footerRow}>
                    <nav className={styles.footerNav} aria-label="Footer">
                        {nav.links.map((l) => (
                            <a key={l.href} href={l.href}>
                                {l.label}
                            </a>
                        ))}
                        <a href={nav.signIn.href}>{nav.signIn.label}</a>
                        <a href={nav.primary.href}>{nav.primary.label}</a>
                    </nav>
                    <div className={styles.footerLegal}>
                        <p>{footer.copyright}</p>
                        <p>{footer.disclaimer}</p>
                    </div>
                </div>
                <p className={styles.credits}>
                    Pictures:{" "}
                    {CREDITS.map(([title, by, licence, href], i) => (
                        <span key={href}>
                            <a href={href}>{title}</a> by {by}, {licence}
                            {i < CREDITS.length - 1 ? "; " : "."}
                        </span>
                    ))}
                </p>
            </footer>
        </div>
    );
}
