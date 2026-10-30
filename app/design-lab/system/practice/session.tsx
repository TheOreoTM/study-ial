"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

import { Button, ButtonLink, MasteryRow } from "../ui";

import p from "./practice.module.css";

type Level = "strong" | "developing" | "weak";
type Result = "correct" | "incorrect";
type Outcome = Result | "skipped";

export type SessionQuestion = {
    number: number;
    total: number;
    type: string;
    difficulty: string;
    marks: number;
    stemBefore: string;
    stemFormulaHtml: string;
    stemAfter: string;
    options: { label: string; text: string; correct?: boolean }[];
    markScheme: string;
    explanation: string;
    history: Outcome[];
    topic: { code: string; name: string; score: number };
    /** Where "Finish session" returns to. */
    topicHref: string;
    otherTopics: { code: string; name: string; score: number; level: Level }[];
};

const levelFor = (score: number): Level => (score >= 70 ? "strong" : score >= 50 ? "developing" : "weak");

export function PracticeSession({ q }: { q: SessionQuestion }) {
    const [selected, setSelected] = useState<string | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [number, setNumber] = useState(q.number);
    const [history, setHistory] = useState<Outcome[]>(q.history);
    const [score, setScore] = useState(q.topic.score);

    const checked = result !== null;
    // "Check answer" is replaced by the next action, so carry keyboard focus over to it.
    const actionsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (checked) actionsRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, [checked]);
    const answered = history.filter((h) => h !== "skipped").length;
    const marks = history.filter((h) => h === "correct").length;
    const delta = score - q.topic.score;

    function check() {
        if (!selected) return;
        const correct = q.options.find((o) => o.label === selected)?.correct === true;
        const r: Result = correct ? "correct" : "incorrect";
        setResult(r);
        setHistory((h) => [...h, r]);
        // Illustrative mastery update; the real app recomputes from recent attempts.
        setScore((s) => Math.max(0, Math.min(100, s + (correct ? 7 : -3))));
    }

    function skip() {
        setHistory((h) => [...h, "skipped"]);
        next();
    }

    function next() {
        setSelected(null);
        setResult(null);
        setNumber((n) => Math.min(n + 1, q.total));
    }

    return (
        <div className={p.layout}>
            <section className={p.card} aria-labelledby="q-stem">
                <div className={p.sessionHead}>
                    <span>
                        Question {number} of {q.total}
                    </span>
                    <span>
                        {marks} of {answered} correct
                    </span>
                </div>

                <ol className={p.dots} aria-label="This session">
                    {Array.from({ length: q.total }, (_, i) => {
                        const prior = history.at(i);
                        // The question on screen stays "current" until the student moves on.
                        const state = prior ?? (i === number - 1 ? "current" : "todo");
                        return (
                            <li key={i} className={`${p.dot} ${p[`dot_${state}`]}`}>
                                <span className={p.srOnly}>
                                    Question {i + 1}: {state === "todo" ? "not started" : state}
                                </span>
                            </li>
                        );
                    })}
                </ol>

                <div className={p.qMeta}>
                    <span>{q.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                        {q.marks} mark{q.marks === 1 ? "" : "s"}
                    </span>
                </div>

                <p id="q-stem" className={p.stem}>
                    {q.stemBefore}
                    <span className={p.formula} dangerouslySetInnerHTML={{ __html: q.stemFormulaHtml }} />
                    {q.stemAfter}
                </p>

                <fieldset className={p.options} disabled={checked}>
                    <legend className={p.srOnly}>Choose one answer</legend>
                    {q.options.map((o) => {
                        const isSel = selected === o.label;
                        const state = !checked
                            ? isSel
                                ? "selected"
                                : "idle"
                            : o.correct
                              ? "right"
                              : isSel
                                ? "wrong"
                                : "dim";
                        return (
                            <label key={o.label} className={`${p.option} ${p[`opt_${state}`]}`}>
                                <input
                                    type="radio"
                                    name="answer"
                                    value={o.label}
                                    checked={isSel}
                                    onChange={() => setSelected(o.label)}
                                    className={p.radio}
                                />
                                <span className={p.optLetter} aria-hidden="true">
                                    {state === "right" ? (
                                        <Check size={18} strokeWidth={3.5} />
                                    ) : state === "wrong" ? (
                                        <X size={18} strokeWidth={3.5} />
                                    ) : (
                                        o.label
                                    )}
                                </span>
                                <span className={p.optText}>
                                    <span className={p.srOnly}>{o.label}. </span>
                                    {o.text}
                                    {state === "right" ? <span className={p.srOnly}> (correct answer)</span> : null}
                                    {state === "wrong" ? <span className={p.srOnly}> (your answer)</span> : null}
                                </span>
                            </label>
                        );
                    })}
                </fieldset>

                <div className={p.feedbackSlot} aria-live="polite">
                    {checked ? (
                        <div className={`${p.feedback} ${result === "correct" ? p.fbRight : p.fbWrong}`}>
                            <p className={p.fbTitle}>
                                {result === "correct" ? "Correct" : "Not quite"}
                                <span className={p.fbMarks}>
                                    {result === "correct" ? q.marks : 0} / {q.marks} mark
                                </span>
                            </p>
                            <p>{q.explanation}</p>
                            <p className={p.fbScheme}>
                                <span>Mark scheme</span> {q.markScheme}
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className={p.actions} ref={actionsRef}>
                    {checked && number >= q.total ? (
                        <ButtonLink href={q.topicHref} arrow>
                            Finish session
                        </ButtonLink>
                    ) : checked ? (
                        <Button arrow onClick={next}>
                            Next question
                        </Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={skip} disabled={number >= q.total}>
                                Skip
                            </Button>
                            <Button onClick={check} disabled={!selected}>
                                Check answer
                            </Button>
                        </>
                    )}
                </div>
            </section>

            <aside className={p.rail} aria-label="Topic progress">
                <section className={p.panel} aria-labelledby="mastery-title">
                    <div className={p.panelHead}>
                        <h2 id="mastery-title" className={p.panelTitle}>
                            Your mastery
                        </h2>
                        {delta !== 0 ? (
                            <span className={`${p.delta} ${delta > 0 ? p.deltaUp : p.deltaDown}`}>
                                {delta > 0 ? `+${delta}` : `\u2212${Math.abs(delta)}`} this session
                            </span>
                        ) : null}
                    </div>
                    <ul className={p.rows}>
                        <MasteryRow
                            compact
                            isNext
                            code={q.topic.code}
                            name={q.topic.name}
                            score={score}
                            level={levelFor(score)}
                            flag={<ArrowRight size={16} strokeWidth={3} />}
                        />
                    </ul>
                    <p className={p.note}>From your last 10 answers in this topic. Weakest in WPH11, so it&apos;s up next.</p>
                </section>

                <section className={p.panel} aria-labelledby="unit-title">
                    <h2 id="unit-title" className={p.panelTitle}>
                        Rest of WPH11
                    </h2>
                    <ul className={p.rows}>
                        {q.otherTopics.map((o) => (
                            <MasteryRow
                                key={o.code}
                                compact
                                code={o.code}
                                name={o.name}
                                score={o.score}
                                level={o.level}
                            />
                        ))}
                    </ul>
                </section>
            </aside>
        </div>
    );
}
