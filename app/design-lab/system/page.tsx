import { ArrowRight, CalendarClock } from "lucide-react";
import type { CSSProperties } from "react";

import { content } from "@/design-lab/content";

import { fontVars } from "./fonts";
import t from "./tokens.module.css";
import { ButtonLink, Chip, Logo, MasteryRow, ProgressBar } from "./ui";

import sp from "./specimen.module.css";

export const metadata = { title: "Design system · Two tiers", robots: { index: false } };

const m = content.masteryExample;

/** The same component calls, rendered once per tier. Only the tier class differs. */
function Components({ tier }: { tier: "marketing" | "app" }) {
    return (
        <div className={sp.stack}>
            <div className={sp.row}>
                <ButtonLink href="#" arrow>
                    Primary action
                </ButtonLink>
                <ButtonLink href="#" variant="secondary">
                    Secondary
                </ButtonLink>
            </div>
            <div className={sp.row}>
                <Chip kind="unit">{m.unitCode}</Chip>
                <Chip icon={<CalendarClock aria-hidden="true" size={15} strokeWidth={2.5} />}>{m.examCountdown}</Chip>
            </div>
            <div className={tier === "marketing" ? sp.board : sp.panel}>
                <ul className={sp.rows}>
                    {m.topics.map((topic, i) => (
                        <MasteryRow
                            key={topic.code}
                            compact={tier === "app"}
                            code={topic.code}
                            name={topic.name}
                            score={topic.score}
                            level={topic.level}
                            isNext={"isNext" in topic && topic.isNext}
                            flag={<ArrowRight size={16} strokeWidth={3} />}
                            style={{ "--i": i } as CSSProperties}
                        />
                    ))}
                </ul>
            </div>
            <ProgressBar value={3} max={10} label="Question 3 of 10" detail="2 of 3 correct" />
        </div>
    );
}

export default function SystemIndex() {
    return (
        <div className={`${t.base} ${sp.page} ${fontVars}`}>
            <header className={sp.head}>
                <p className={sp.brand}>
                    <Logo /> Study-IAL design system
                </p>
                <h1 className={sp.title}>One component set, two tiers</h1>
                <p className={sp.lede}>
                    Marketing pages use the bold orange and purple fields. The app shell is calm cream and white, with
                    orange for actions, purple for progress and selection, and mastery colours only where a mastery
                    level is shown. Both columns below are the same component calls; only the tier class changes.
                </p>
                <nav className={sp.links} aria-label="Examples">
                    <a href="/design-lab/system/marketing">Marketing tier: homepage</a>
                    <a href="/design-lab/system/practice">App tier: topic practice</a>
                </nav>
            </header>

            <div className={sp.compare}>
                <section className={`${t.marketing} ${sp.tier} ${sp.tierMarketing}`} aria-labelledby="tier-m">
                    <h2 id="tier-m" className={sp.tierTitle}>
                        Marketing tier
                    </h2>
                    <Components tier="marketing" />
                </section>
                <section className={`${t.app} ${sp.tier} ${sp.tierApp}`} aria-labelledby="tier-a">
                    <h2 id="tier-a" className={sp.tierTitle}>
                        App tier
                    </h2>
                    <Components tier="app" />
                </section>
            </div>
        </div>
    );
}
