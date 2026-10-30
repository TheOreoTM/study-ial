import Link from "next/link";
import katex from "katex";
import { CalendarClock, ChevronRight } from "lucide-react";

import { fontVars } from "../fonts";
import t from "../tokens.module.css";
import { ButtonLink, Chip, Logo } from "../ui";
import { PracticeSession, type SessionQuestion } from "./session";

import p from "./practice.module.css";

export const metadata = { title: "Design system · App tier · Practice", robots: { index: false } };

// Static mock data. The question is the real seeded item phy-wph11-fluids-001.
const formula = katex.renderToString(String.raw`F = 6\pi\eta r v`, { throwOnError: false });

const question: SessionQuestion = {
    number: 3,
    total: 10,
    type: "Multiple choice",
    difficulty: "Easy",
    marks: 1,
    stemBefore: "Stokes' law, ",
    stemFormulaHtml: formula,
    stemAfter: ", can be used to calculate the viscous drag on an object only if the object is",
    options: [
        { label: "A", text: "a small sphere moving slowly with laminar flow around it", correct: true },
        { label: "B", text: "a small sphere moving at high speed with turbulent flow around it" },
        { label: "C", text: "any shape moving at terminal velocity" },
        { label: "D", text: "a large sphere floating at the surface of the fluid" },
    ],
    markScheme: "A (1): Stokes' law applies to small spheres at low speed with laminar (streamline) flow.",
    explanation:
        "Stokes' law assumes a sphere and laminar flow. At high speeds the flow becomes turbulent and the drag is much larger than the formula predicts.",
    // Earlier answers in this session.
    history: ["correct", "incorrect"],
    topic: { code: "1.5", name: "Density, upthrust and viscosity", score: 38 },
    topicHref: "/subjects/physics/wph11/fluids",
    otherTopics: [
        { code: "1.1", name: "Motion and kinematics", score: 86, level: "strong" },
        { code: "1.3", name: "Momentum", score: 71, level: "strong" },
        { code: "1.6", name: "Hooke's law, stress and strain", score: 64, level: "developing" },
    ],
};

const appNav = [
    { label: "Today", href: "/dashboard" },
    { label: "Subjects", href: "/subjects", current: true },
    { label: "Progress", href: "/progress" },
    { label: "Study plans", href: "/plans" },
    { label: "Focus", href: "/focus" },
];

export default function PracticeMock() {
    return (
        <div className={`${t.base} ${t.app} ${p.page} ${fontVars}`}>
            <a className={p.skip} href="#main">
                Skip to content
            </a>

            <header className={p.appBar}>
                <div className={p.appBarInner}>
                    <Link className={p.brand} href="/dashboard">
                        <Logo />
                        <span>Study-IAL</span>
                    </Link>
                    <nav className={p.appNav} aria-label="App">
                        <ul>
                            {appNav.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        className={p.appNavLink}
                                        href={item.href}
                                        aria-current={item.current ? "page" : undefined}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>

            <main id="main" className={p.main}>
                <div className={p.head}>
                    <nav aria-label="Breadcrumb">
                        <ol className={p.crumbs}>
                            <li>
                                <Link href="/subjects/physics">Physics</Link>
                                <ChevronRight aria-hidden="true" size={14} strokeWidth={2.5} />
                            </li>
                            <li>
                                <Link href="/subjects/physics/wph11">WPH11 Mechanics and Materials</Link>
                                <ChevronRight aria-hidden="true" size={14} strokeWidth={2.5} />
                            </li>
                            <li aria-current="page">1.5 Practice</li>
                        </ol>
                    </nav>
                    <div className={p.titleRow}>
                        <div className={p.titleBlock}>
                            <h1 className={p.title}>{question.topic.name}</h1>
                            <div className={p.chips}>
                                <Chip kind="unit">WPH11</Chip>
                                <Chip icon={<CalendarClock aria-hidden="true" size={15} strokeWidth={2.5} />}>
                                    Exam in 74 days
                                </Chip>
                            </div>
                        </div>
                        <ButtonLink href={question.topicHref} variant="secondary" className={p.endBtn}>
                            End session
                        </ButtonLink>
                    </div>
                </div>

                <PracticeSession q={question} />
            </main>
        </div>
    );
}
