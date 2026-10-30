import { EB_Garamond } from "next/font/google";

import { content } from "@/design-lab/content";

import { HeroRooms, MasteryArch, Reveals, StepBays } from "./client";
import s from "./old-library.module.css";

const garamond = EB_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--ol-serif",
    display: "swap",
});

export const metadata = { title: "Old Library · Taste", robots: { index: false } };

const IMG = "/design-lab/old-library-taste";

const rooms = [
    { src: `${IMG}/congress-reading-room.jpg`, alt: "An arched doorway opening onto the main reading room of the Library of Congress" },
    { src: `${IMG}/trinity-long-room.jpg`, alt: "A library ladder against tall shelves of leather-bound books beside a bright window" },
    { src: `${IMG}/rylands-reading-room.jpg`, alt: "A wood-panelled reading room corner with a desk, chairs and a green glass lamp" },
];

const stepPictures = [
    { img: `${IMG}/congress-reading-room.jpg`, alt: "An arched doorway into a reading room" },
    { img: `${IMG}/rylands-reading-room.jpg`, alt: "A reading desk under a green lamp" },
    { img: `${IMG}/brass-microscope.jpg`, alt: "A small brass microscope from the 1800s in its wooden box" },
];

const subjectPictures: Record<string, { src: string; alt: string }> = {
    Physics: { src: `${IMG}/atwood-machine.jpg`, alt: "An antique Atwood machine for mechanics experiments" },
    Chemistry: { src: `${IMG}/lavoisier-apparatus.jpg`, alt: "An engraving of Lavoisier's chemical apparatus" },
    Biology: { src: `${IMG}/fern-nature-print.jpg`, alt: "A nineteenth-century nature print of ferns" },
    Mathematics: { src: `${IMG}/euclid-1482.jpg`, alt: "Geometric diagrams from the first printed edition of Euclid" },
    "Further Mathematics": { src: `${IMG}/euclid-byrne-1847.jpg`, alt: "Oliver Byrne's coloured edition of Euclid's Elements" },
};

const credits = [
    ["Main reading room of the Library of Congress", "APK", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Main_reading_room_of_the_Library_of_Congress_-_1.jpg"],
    ["Old Library at Trinity College Dublin", "Rhagfyr", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Old_Library_at_Trinity_College_Dublin.jpg"],
    ["Reading Room, John Rylands Library", "Andy Stephenson", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Reading_Room,_John_Rylands_Library_-_geograph.org.uk_-_5277946.jpg"],
    ["Nachet brass chest microscope", "Daderot", "CC0", "https://commons.wikimedia.org/wiki/File:1850-1880,_Nachet_small_brass_chest_microscope,_Nachet_%26_Son,_France,_compound_microscope_-_Golub_Collection_of_Antique_Microscopes_-_DSC04716.JPG"],
    ["Máquina de Atwood, Museu Maynense", "GualdimG", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:M%C3%A1quina_de_Atwood_Museu_Maynense,_Academia_das_Ci%C3%AAncias_de_Lisboa_01.jpg"],
    ["Lavoisier's apparatus, plate IV", "Marie-Anne Paulze Lavoisier", "public domain", "https://commons.wikimedia.org/wiki/File:Scientific_apparatus_used_by_Lavoisier_in_studying_chemical_reactions_in_combustion_of_substances,_including_mercury,_top_right)_-_Paulze_Lavoisier,_sculpt_LCCN92517580.tif"],
    ["Nature print of ferns, plate 51", "Henry Bradbury", "CC0, Art Institute of Chicago", "https://www.artic.edu/artworks/13634"],
    ["Euclid's Elements, 1482", "Library of Congress", "public domain", "https://commons.wikimedia.org/wiki/File:Geometric_diagrams_in_margins_of_text_of_first_printed_edition_of_Euclid%27s_%22Elements,%22_which_they_illus.-_2_diagrams_at_left_of_text_(page_headed_%22Liber%22)_LCCN2005683645.jpg"],
    ["The First Six Books of the Elements of Euclid", "Oliver Byrne", "public domain", "https://commons.wikimedia.org/wiki/File:The_First_Six_Books_of_the_Elements_of_Euclid.jpg"],
] as const;

/* Block wordmark heights, as a share of the band */
const markHeights = [100, 78, 88, 70, 94, 62, 100, 84, 92];

export default function OldLibraryTastePage() {
    const { nav, hero, stats, masteryExample: m, howItWorks, features, subjects, closing, footer } = content;
    const steps = howItWorks.steps.map((step, i) => ({ ...step, ...stepPictures[i] }));
    const [s175, s114, sFree] = stats;

    return (
        <div className={`${garamond.variable} ${s.page}`}>
            <Reveals />
            <header className={s.nav}>
                <a href="#top" className={s.brand}>
                    <span className={s.brandArch} aria-hidden />
                    {content.brand}
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
                    <a href={nav.primary.href} className={`${s.button} ${s.buttonBrass} ${s.navButton}`}>
                        {nav.primary.label}
                    </a>
                </nav>
            </header>

            <main id="top">
                {/* Hero: the cream card beside the reading room, then the figures as three arched bays */}
                <section className={s.hero} aria-labelledby="hero-title">
                    <div className={s.heroSplit}>
                        <div className={s.card}>
                            <div className={s.arcade} aria-hidden>
                                {Array.from({ length: 22 }, (_, i) => (
                                    <span key={i} />
                                ))}
                            </div>
                            <div className={s.cardBody}>
                                <h1 id="hero-title" className={s.display}>
                                    {hero.headline}
                                </h1>
                                <p className={s.lead}>{hero.subtext}</p>
                                <div className={s.ctaRow}>
                                    <a href={hero.primaryCta.href} className={`${s.button} ${s.buttonGreen}`}>
                                        {hero.primaryCta.label}
                                    </a>
                                    <a href={hero.secondaryCta.href} className={s.textLink}>
                                        {hero.secondaryCta.label}
                                    </a>
                                </div>
                            </div>
                            <p className={s.audience}>{hero.audience}</p>
                        </div>
                        <HeroRooms rooms={rooms} />
                    </div>

                    <ul className={s.bays3} aria-label="Study-IAL in figures">
                        <li className={`${s.statBay} ${s.statTall}`} data-reveal>
                            <span className={s.statValue}>{s175.value}</span>
                            <span className={s.statLabel}>{s175.label}</span>
                        </li>
                        <li className={`${s.statBay} ${s.statMid}`} data-reveal>
                            <span className={s.statValue}>{s114.value}</span>
                            <span className={s.statLabel}>{s114.label}</span>
                        </li>
                        <li className={`${s.statBay} ${s.statLow}`} data-reveal>
                            <span className={s.statValue}>{sFree.value}</span>
                            <span className={s.statLabel}>{sFree.label}</span>
                        </li>
                    </ul>
                </section>

                {/* The product example: one unit, its topics as arches that fill with brass */}
                <section className={s.mastery} aria-labelledby="unit-title">
                    <div className={s.masteryHead}>
                        <h2 id="unit-title" className={s.head} data-reveal>
                            <span className={s.unitCode}>{m.unitCode}</span> {m.unitName}
                        </h2>
                        <p className={s.countdown} data-reveal>
                            {m.examCountdown}
                        </p>
                    </div>
                    <MasteryArch topics={m.topics} nextUp={m.nextUp} />
                </section>

                <section className={s.how} aria-labelledby="how-title">
                    <h2 id="how-title" className={s.head} data-reveal>
                        {howItWorks.heading}
                    </h2>
                    <div data-reveal>
                        <StepBays steps={steps} />
                    </div>
                </section>

                <section className={s.features} aria-labelledby="features-title">
                    <div className={s.featureArch} data-reveal>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${IMG}/trinity-long-room.jpg`}
                            alt="Tall shelves of old books and a library ladder in Trinity College's Old Library"
                            width={1600}
                            height={2133}
                            loading="lazy"
                        />
                    </div>
                    <div className={s.featureText}>
                        <h2 id="features-title" className={s.head} data-reveal>
                            {features.heading}
                        </h2>
                        <ul className={s.points}>
                            {features.items.map((f, i) => (
                                <li key={f.title} className={s.point} data-reveal>
                                    <h3 className={s.pointTitle}>
                                        <span className={`${s.archMark} ${s[`mark${i % 3}`]}`} aria-hidden />
                                        {f.title}
                                    </h3>
                                    <p className={s.pointBody}>{f.body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className={s.subjects} aria-labelledby="subjects-title">
                    <h2 id="subjects-title" className={s.head} data-reveal>
                        {subjects.heading}
                    </h2>
                    <ul className={s.shelf}>
                        {subjects.items.map((sub) => {
                            const pic = subjectPictures[sub.name];
                            return (
                                <li key={sub.href} data-reveal>
                                    <a href={sub.href} className={s.shelfItem}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={pic.src} alt={pic.alt} width={160} height={200} loading="lazy" className={s.shelfImg} />
                                        <span className={s.shelfName}>{sub.name}</span>
                                        <span className={s.shelfUnits}>
                                            {sub.units} units
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className={s.closing} aria-labelledby="closing-title">
                    <div className={s.closingArch}>
                        <div className={s.closingInner}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${IMG}/congress-reading-room.jpg`}
                                alt="Looking through an arched doorway into a great domed reading room"
                                width={1600}
                                height={2133}
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className={s.closingText}>
                        <h2 id="closing-title" className={s.head} data-reveal>
                            {closing.headline}
                        </h2>
                        <ul className={s.closingPoints} data-reveal>
                            {closing.points.map((p) => (
                                <li key={p}>
                                    <span className={s.archDotBrass} aria-hidden />
                                    {p}
                                </li>
                            ))}
                        </ul>
                        <a href={closing.cta.href} className={`${s.button} ${s.buttonBrass}`} data-reveal>
                            {closing.cta.label}
                        </a>
                    </div>
                </section>
            </main>

            <footer className={s.footer}>
                <div className={s.mark} role="img" aria-label={content.brand}>
                    {content.brand.split("").map((ch, i) => (
                        <span key={i} className={`${s.markBlock} ${s[`markTone${i % 3}`]}`} style={{ height: `${markHeights[i]}%` }}>
                            {ch}
                        </span>
                    ))}
                </div>
                <div className={s.footRow}>
                    <nav aria-label="Footer" className={s.footLinks}>
                        {nav.links.map((l) => (
                            <a key={l.href} href={l.href} className={s.textLinkLight}>
                                {l.label}
                            </a>
                        ))}
                        <a href={nav.signIn.href} className={s.textLinkLight}>
                            {nav.signIn.label}
                        </a>
                        <a href={nav.primary.href} className={s.textLinkLight}>
                            {nav.primary.label}
                        </a>
                    </nav>
                    <div className={s.footLegal}>
                        <p>{footer.copyright}</p>
                        <p>{footer.disclaimer}</p>
                    </div>
                </div>
                <p className={s.credits}>
                    Pictures:{" "}
                    {credits.map(([title, by, licence, href], i) => (
                        <span key={href}>
                            <a href={href} className={s.creditLink}>
                                {title}
                            </a>{" "}
                            by {by}, {licence}
                            {i < credits.length - 1 ? "; " : "."}
                        </span>
                    ))}
                </p>
            </footer>
        </div>
    );
}
