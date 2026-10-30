import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import u from "./ui.module.css";

type Level = "strong" | "developing" | "weak";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Logo({ className }: { className?: string }) {
    return (
        <svg className={cx(u.logo, className)} viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="13" fill="currentColor" />
            <rect className={u.logoBarA} x="9" y="22" width="6" height="9" rx="3" />
            <rect className={u.logoBarB} x="17" y="16" width="6" height="15" rx="3" />
            <rect className={u.logoBarC} x="25" y="9" width="6" height="22" rx="3" />
        </svg>
    );
}

type ButtonProps = {
    variant?: "primary" | "secondary" | "sun";
    size?: "md" | "lg";
    /** Adds the trailing arrow used on forward actions. */
    arrow?: boolean;
    className?: string;
    children: ReactNode;
};

/** A link styled as a button (navigation). */
export function ButtonLink({
    href,
    variant = "primary",
    size = "md",
    arrow,
    className,
    children,
}: ButtonProps & { href: string }) {
    const cls = cx(u.btn, u[variant], size === "lg" && u.lg, className);
    const inner = (
        <>
            {children}
            {arrow ? <ArrowRight aria-hidden="true" size={size === "lg" ? 20 : 18} strokeWidth={3} /> : null}
        </>
    );
    // Internal routes use next/link; everything else is a plain anchor.
    return href.startsWith("/") ? (
        <Link className={cls} href={href}>
            {inner}
        </Link>
    ) : (
        <a className={cls} href={href}>
            {inner}
        </a>
    );
}

/** A real <button> (in-page actions). */
export function Button({
    variant = "primary",
    size = "md",
    arrow,
    className,
    children,
    ...rest
}: ButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
    return (
        <button type="button" className={cx(u.btn, u[variant], size === "lg" && u.lg, className)} {...rest}>
            {children}
            {arrow ? <ArrowRight aria-hidden="true" size={size === "lg" ? 20 : 18} strokeWidth={3} /> : null}
        </button>
    );
}

export function Chip({
    kind = "neutral",
    icon,
    className,
    children,
}: {
    kind?: "neutral" | "unit";
    icon?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <span className={cx(u.chip, kind === "unit" && u.chipUnit, className)}>
            {icon}
            {children}
        </span>
    );
}

/**
 * One topic's mastery: code tile, name, score, bar and level word.
 * `isNext` marks the topic to revise next (lifted row with a flag).
 */
export function MasteryRow({
    code,
    name,
    score,
    level,
    isNext,
    compact,
    className,
    style,
    flag,
    intro,
}: {
    code: string;
    name: string;
    score: number;
    level: Level;
    isNext?: boolean;
    compact?: boolean;
    className?: string;
    style?: CSSProperties;
    /** Optional marker drawn at the row's left edge when `isNext`. */
    flag?: ReactNode;
    /** Marketing intro motion: the bar fills on load (staggered by the `--i` style var). */
    intro?: boolean;
}) {
    return (
        <li
            className={cx(u.row, u[level], isNext && u.rowNext, compact && u.compact, intro && u.intro, className)}
            style={{ "--score": `${score}%`, ...style } as CSSProperties}
        >
            <span className={u.rowCode}>{code}</span>
            <span className={u.rowName}>{name}</span>
            <span className={u.rowScore}>{score}%</span>
            <span className={u.rowBar} aria-hidden="true">
                <span className={u.rowFill} />
            </span>
            <span className={u.rowLevel}>{level}</span>
            {isNext && flag ? (
                <span className={u.rowFlag} aria-hidden="true">
                    {flag}
                </span>
            ) : null}
        </li>
    );
}

export function ProgressBar({ value, max, label, detail }: { value: number; max: number; label: string; detail: string }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className={u.progress}>
            <div className={u.progressHead}>
                <span>{label}</span>
                <span>{detail}</span>
            </div>
            <span
                className={u.progressTrack}
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                style={{ "--value": `${pct}%` } as CSSProperties}
            >
                <span className={u.progressFill} />
            </span>
        </div>
    );
}

