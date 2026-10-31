import { ArrowRight, CalendarClock, Check, Play, TrendingUp, X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import s from "./landing.module.css";

// Pieces of the "Playful Pop B" marketing homepage (see DESIGN.md, marketing tier). Server components only.

type Level = "strong" | "developing" | "weak";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** The illustrated product example on the hero. Static: it is not the visitor's data. */
export const masteryExample = {
    unitCode: "WPH11",
    unitName: "Mechanics and Materials",
    examCountdown: "Exam in 74 days",
    topics: [
        { code: "1.1", name: "Motion and kinematics", score: 86, level: "strong" },
        { code: "1.3", name: "Momentum", score: 71, level: "strong" },
        { code: "1.5", name: "Density, upthrust and viscosity", score: 38, level: "weak", isNext: true },
        { code: "1.6", name: "Hooke's law, stress and strain", score: 64, level: "developing" },
    ] as { code: string; name: string; score: number; level: Level; isNext?: boolean }[],
    nextUp: "Next up: density, upthrust and viscosity. 10 questions.",
};

const m = masteryExample;
const weakTopic = m.topics.find((t) => t.isNext) ?? m.topics[0];
/** Where the "Fix what's weak" step lands on hover: a developing score (50–74%, see lib/mastery.ts). */
const PRACTISED_SCORE = 64;

const levelClass: Record<Level, string> = {
    strong: s.levelStrong,
    developing: s.levelDeveloping,
    weak: s.levelWeak,
};

/** The brand mark: an ink tile with the three rising mastery bars. */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg className={cx(s.logo, className)} viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="13" fill="currentColor" />
            <path className={s.logoBarA} d="M8 32V26.5Q8 24 10.5 24H13Q15.5 24 15.5 26.5V32Z" />
            <path className={s.logoBarB} d="M16.25 32V21Q16.25 18.5 18.75 18.5H21.25Q23.75 18.5 23.75 21V32Z" />
            <path className={s.logoBarC} d="M24.5 32V15.5Q24.5 13 27 13H29.5Q32 13 32 15.5V32Z" />
            <rect className={s.logoBase} x="7" y="31" width="26" height="2.5" rx="1.25" />
            <circle className={s.logoDot} cx="28.25" cy="7.5" r="3.5" />
        </svg>
    );
}

function MasteryRow({
    code,
    name,
    score,
    level,
    isNext,
    index,
}: {
    code: string;
    name: string;
    score: number;
    level: Level;
    isNext?: boolean;
    index: number;
}) {
    return (
        <li
            className={cx(s.row, levelClass[level], isNext && s.rowNext)}
            style={{ "--score": `${score}%`, "--i": index } as CSSProperties}
        >
            <span className={s.rowCode}>{code}</span>
            <span className={s.rowName}>{name}</span>
            <span className={s.rowScore}>{score}%</span>
            <span className={s.rowBar}>
                <span className={s.rowFill} />
            </span>
            <span className={s.rowLevel}>{level}</span>
            {isNext ? (
                <span className={s.rowFlag}>
                    <ArrowRight size={18} strokeWidth={3} />
                </span>
            ) : null}
        </li>
    );
}

function Chip({
    unit,
    icon,
    className,
    children,
}: {
    unit?: boolean;
    icon?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <span className={cx(s.chip, unit && s.chipUnit, className)}>
            {icon}
            {children}
        </span>
    );
}

/** The hero's mastery board. An illustration, so screen readers get a one-line description instead of the rows. */
export function MasteryBoard() {
    return (
        <figure
            className={s.board}
            role="img"
            aria-label="Example: topic mastery for a physics unit, weakest topic flagged next"
        >
            <div aria-hidden="true">
                <div className={s.boardHead}>
                    <Chip unit>{m.unitCode}</Chip>
                    <span className={s.unitName}>{m.unitName}</span>
                    <Chip className={s.countdown} icon={<CalendarClock size={16} strokeWidth={2.5} />}>
                        {m.examCountdown}
                    </Chip>
                </div>
                <ul className={s.topics}>
                    {m.topics.map((topic, i) => (
                        <MasteryRow key={topic.code} index={i} {...topic} />
                    ))}
                </ul>
                <div className={s.nextUp}>
                    <span className={s.nextUpIcon}>
                        <Play size={16} strokeWidth={3} fill="currentColor" />
                    </span>
                    {m.nextUp}
                </div>
            </div>
        </figure>
    );
}

/** Small product fragments for each step. Decorative: the step text carries the meaning. */
export function StepFragment({ index }: { index: number }) {
    if (index === 0) {
        return (
            <div className={cx(s.frag, s.fragRow)} aria-hidden="true">
                <span className={s.fragPick}>
                    <span className={s.fragUnit}>{m.unitCode}</span>
                    <span className={s.fragTick}>
                        <Check size={12} strokeWidth={4} />
                    </span>
                </span>
                <span className={s.fragUnitName}>{m.unitName}</span>
                <span className={s.fragDate}>
                    <CalendarClock size={14} strokeWidth={2.75} />
                    {m.examCountdown}
                </span>
                <span className={s.fragPlan}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} style={{ "--i": i } as CSSProperties} />
                    ))}
                </span>
            </div>
        );
    }
    if (index === 1) {
        const marks = ["ok", "ok", "miss", "ok", "todo"] as const;
        const markClass = { ok: s.markOk, miss: s.markMiss, todo: s.markTodo };
        return (
            <div className={s.frag} aria-hidden="true">
                <span className={s.fragTopic}>
                    <span className={s.fragCode}>{weakTopic.code}</span>
                    <span className={s.fragTopicName}>{weakTopic.name}</span>
                </span>
                <span className={s.marks}>
                    {marks.map((mk, i) => (
                        <span
                            key={i}
                            className={cx(s.mark, markClass[mk])}
                            style={{ "--i": i } as CSSProperties}
                        >
                            <Check className={s.markCheck} size={14} strokeWidth={3.5} />
                            {mk === "miss" ? <X className={s.markX} size={14} strokeWidth={3.5} /> : null}
                        </span>
                    ))}
                </span>
            </div>
        );
    }
    return (
        <div className={s.frag} aria-hidden="true">
            <span className={s.fragTopic}>
                <span className={cx(s.fragCode, s.fragCodeWeak)}>{weakTopic.code}</span>
                <span
                    className={s.fragScore}
                    style={{ "--from": weakTopic.score, "--to": PRACTISED_SCORE } as CSSProperties}
                />
                <TrendingUp className={s.fragTrend} size={20} strokeWidth={3} />
            </span>
            <span
                className={s.fragBar}
                style={{ "--score": `${weakTopic.score}%`, "--goal": `${PRACTISED_SCORE}%` } as CSSProperties}
            >
                <span className={s.fragBarFill} />
                <span className={s.fragBarGoal} />
            </span>
        </div>
    );
}

/** The bars inside the "Mastery you can see" tile. Decorative. */
export function MasteryStrip() {
    return (
        <div className={s.strip} aria-hidden="true">
            {m.topics.map((t) => (
                <span
                    key={t.code}
                    className={cx(s.stripRow, levelClass[t.level])}
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
