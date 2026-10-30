import { Nunito } from "next/font/google";

import { content } from "@/design-lab/content";

import { MasteryPlate } from "./mastery-plate";
import styles from "./page.module.css";
import { Reveal } from "./reveal";
import { Steps } from "./steps";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "800"], display: "swap" });

export const metadata = { title: "Lo-fi Study Room · Taste", robots: { index: false } };

const IMG = "/design-lab/lofi-study-room-taste";

const featurePictures: { src: string; alt: string; fit?: string }[] = [
    { src: `${IMG}/chemistry.jpg`, alt: "An old laboratory bench with test tubes and glassware by a window" },
    { src: `${IMG}/further.jpg`, alt: "A brass astrolabe with engraved dials", fit: "astrolabe" },
    { src: `${IMG}/sunset.jpg`, alt: "A red dusk sky over the lagoon in the Maldives" },
    { src: `${IMG}/physics.jpg`, alt: "A glass optical prism splitting light into colours" },
    { src: `${IMG}/lamp.jpg`, alt: "A desk lamp glowing on a desk at night" },
    { src: `${IMG}/male.jpg`, alt: "Aerial view of Malé, capital of the Maldives" },
];

const subjectPictures: Record<string, { src: string; alt: string }> = {
    Physics: { src: `${IMG}/physics.jpg`, alt: "A glass optical prism" },
    Chemistry: { src: `${IMG}/chemistry.jpg`, alt: "An old chemistry laboratory bench" },
    Biology: { src: `${IMG}/biology.jpg`, alt: "Pressed fern specimens and a cyanotype print" },
    Mathematics: { src: `${IMG}/mathematics.jpg`, alt: "An iron architect's compass" },
    "Further Mathematics": { src: `${IMG}/further.jpg`, alt: "A brass astrolabe" },
};

const blockColours = ["var(--mustard)", "var(--terracotta)", "var(--rose)", "var(--sand)"];
const blockHeights = [100, 78, 88, 64, 92, 70, 100, 82, 74];

export default function LofiStudyRoomTaste() {
    const { nav, hero, stats, masteryExample, howItWorks, features, subjects, closing, footer } = content;
    const [topics, questions, free] = stats;

    return (
        <div className={`${styles.page} ${nunito.className}`}>
            <Reveal />
            <a className={styles.skip} href="#main">
                Skip to content
            </a>

            <header className={styles.nav}>
                <a className={styles.wordmark} href="#top" aria-label={`${content.brand} home`}>
                    <span className={styles.wordmarkDot} aria-hidden="true" />
                    {content.brand}
                </a>
                <nav className={styles.navLinks} aria-label="Main">
                    {nav.links.map((link) => (
                        <a key={link.href} className={`${styles.navLink} ${styles.navHideSm}`} href={link.href}>
                            {link.label}
                        </a>
                    ))}
                    <a className={styles.navLink} href={nav.signIn.href}>
                        {nav.signIn.label}
                    </a>
                    <a className={`${styles.button} ${styles.buttonSmall}`} href={nav.primary.href}>
                        {nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="main">
                {/* Hero: the desk lamp's pool of light, as one enormous flat circle */}
                <section id="top" className={styles.hero} aria-labelledby="hero-title">
                    <div className={styles.heroText}>
                        <h1 id="hero-title" className={styles.heroTitle} data-reveal>
                            {hero.headline}
                        </h1>
                        <p className={styles.heroSub} data-reveal>
                            {hero.subtext}
                        </p>
                        <div className={styles.heroActions} data-reveal>
                            <a className={styles.button} href={hero.primaryCta.href}>
                                {hero.primaryCta.label}
                            </a>
                            <a className={styles.textLink} href={hero.secondaryCta.href}>
                                {hero.secondaryCta.label}
                            </a>
                        </div>
                    </div>

                    <div className={styles.poolWrap}>
                        <div className={styles.lampPool} aria-hidden="true" />
                        <p className={styles.audience} data-reveal>
                            {hero.audience}
                        </p>
                    </div>

                    <div className={styles.stats}>
                        <dl className={styles.statTiles}>
                            <div className={`${styles.tile} ${styles.tileTall}`} data-reveal>
                                <dt className={styles.tileCaption}>{topics.label}</dt>
                                <dd className={styles.tileFigure}>{topics.value}</dd>
                            </div>
                            <div className={`${styles.tile} ${styles.tileMid}`} data-reveal>
                                <dt className={styles.tileCaption}>{questions.label}</dt>
                                <dd className={styles.tileFigure}>{questions.value}</dd>
                            </div>
                            <div className={`${styles.tile} ${styles.tileLow}`} data-reveal>
                                <dt className={styles.tileCaption}>{free.label}</dt>
                                <dd className={styles.tileFigure}>{free.value}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                {/* Showcase: the mastery example, ringed around the lamp */}
                <MasteryPlate
                    example={masteryExample}
                    picture={{ src: `${IMG}/lamp.jpg`, alt: "A desk lamp glowing on a desk at night" }}
                />

                <Steps heading={howItWorks.heading} steps={howItWorks.steps} />

                {/* Features: specimens on colour tiles */}
                <section className={styles.features} aria-labelledby="features-title">
                    <h2 id="features-title" className={styles.sectionTitle} data-reveal>
                        {features.heading}
                    </h2>
                    <ul className={styles.specimens}>
                        {features.items.map((item, i) => (
                            <li
                                key={item.title}
                                className={`${styles.specimen} ${i === 1 || i === 5 ? styles.specimenWide : ""}`}
                                data-reveal
                            >
                                <div className={styles.specimenTile} data-tone={i % 3}>
                                    <span className={styles.specimenDisc}>
                                        <img
                                            src={featurePictures[i].src}
                                            alt={featurePictures[i].alt}
                                            width={600}
                                            height={600}
                                            loading="lazy"
                                            data-fit={featurePictures[i].fit}
                                        />
                                    </span>
                                </div>
                                <h3 className={styles.specimenName}>{item.title}</h3>
                                <p className={styles.specimenBody}>{item.body}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Subjects: index with preview */}
                <section className={styles.subjects} aria-labelledby="subjects-title">
                    <h2 id="subjects-title" className={styles.sectionTitle} data-reveal>
                        {subjects.heading}
                    </h2>
                    <div className={styles.index}>
                        <ul className={styles.indexList}>
                            {subjects.items.map((s) => (
                                <li key={s.href}>
                                    <a className={styles.indexRow} href={s.href}>
                                        <img
                                            data-reveal
                                            className={styles.indexBullet}
                                            src={subjectPictures[s.name].src}
                                            alt=""
                                            width={64}
                                            height={64}
                                            loading="lazy"
                                        />
                                        <span className={styles.indexName} data-reveal>{s.name}</span>
                                        <span className={styles.indexUnits} data-reveal>
                                            {s.units} <span className={styles.indexUnitsWord}>units</span>
                                        </span>
                                        <span className={styles.indexFrame} aria-hidden="true">
                                            <img
                                                src={subjectPictures[s.name].src}
                                                alt=""
                                                width={640}
                                                height={640}
                                                loading="lazy"
                                            />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Closing: the dusk over the lagoon */}
                <section className={styles.closing} aria-labelledby="closing-title">
                    <div className={styles.closingPicture}>
                        <img
                            src={`${IMG}/sunset.jpg`}
                            alt="A red dusk sky over a shallow lagoon in the Maldives"
                            width={1600}
                            height={900}
                            loading="lazy"
                        />
                    </div>
                    <div className={styles.closingText}>
                        <h2 id="closing-title" className={styles.closingTitle} data-reveal>
                            {closing.headline}
                        </h2>
                        <ul className={styles.closingPoints} data-reveal>
                            {closing.points.map((p) => (
                                <li key={p}>
                                    <span className={styles.dot} aria-hidden="true" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                        <a className={`${styles.button} ${styles.buttonLight}`} href={closing.cta.href} data-reveal>
                            {closing.cta.label}
                        </a>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <svg
                    className={styles.blockMark}
                    viewBox="0 0 904 300"
                    role="img"
                    aria-label={content.brand}
                    preserveAspectRatio="xMidYMax meet"
                >
                    {content.brand.split("").map((ch, i) => {
                        const h = 3 * blockHeights[i % blockHeights.length];
                        const x = i * 100.5;
                        return (
                            <g key={i} className={styles.block}>
                                <path
                                    d={`M${x} 300 V${300 - h + 48} a48 48 0 0 1 96.5 0 V300 Z`}
                                    fill={blockColours[i % blockColours.length]}
                                />
                                <text x={x + 48.25} y={300 - h + 104} textAnchor="middle" className={styles.blockLetter}>
                                    {ch}
                                </text>
                            </g>
                        );
                    })}
                </svg>
                <div className={styles.footerRow}>
                    <nav className={styles.footerLinks} aria-label="Footer">
                        {nav.links.map((link) => (
                            <a key={link.href} href={link.href}>
                                {link.label}
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
                    <a href="https://commons.wikimedia.org/wiki/File:Sunset_of_the_Maldives_2009.jpg">
                        “Sunset of the Maldives 2009”
                    </a>{" "}
                    by benito roveran, <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>;{" "}
                    <a href="https://commons.wikimedia.org/wiki/File:Incandescent_bulb_lamp_glowing_on_a_desk_at_night.jpg">
                        “Incandescent bulb lamp glowing on a desk at night”
                    </a>{" "}
                    by Sihyeon0621, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>;{" "}
                    <a href="https://commons.wikimedia.org/wiki/File:Male-total.jpg">“Male-total”</a> by Shahee Ilyas,{" "}
                    <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>;{" "}
                    <a href="https://commons.wikimedia.org/wiki/File:Glass_optical_prism_002_(52277188123).jpg">
                        “Glass optical prism 002”
                    </a>{" "}
                    by Jan Helebrant, CC0;{" "}
                    <a href="https://commons.wikimedia.org/wiki/File:Laboratory,_test_tube_Fortepan_95220.jpg">
                        “Laboratory, test tube”
                    </a>{" "}
                    by Fortepan, public domain; all via Wikimedia Commons.{" "}
                    <a href="https://www.artic.edu/artworks/125577">Fern study, Hatton Fern Album</a>,{" "}
                    <a href="https://www.artic.edu/artworks/79228">Architect&rsquo;s Compass</a> and{" "}
                    <a href="https://www.artic.edu/artworks/90589">Astrolabe</a>, public domain (CC0), via Art
                    Institute of Chicago.
                </p>
            </footer>
        </div>
    );
}
