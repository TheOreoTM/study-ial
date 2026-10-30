import Link from "next/link";
import { Caveat, Fraunces, Literata } from "next/font/google";
import { InkTick } from "@/components/landing/ink";
import { NotebookPage } from "@/components/landing/notebook-page";
import { db } from "@/lib/db";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK", "opsz"] });
const literata = Literata({ subsets: ["latin"], variable: "--font-literata", axes: ["opsz"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-caveat" });

const steps = [
    {
        title: "Pick your units",
        body: "Tell us which IAL units you're sitting and when. WPH11 in January? We plan around it.",
    },
    {
        title: "Practise by topic",
        body: "Every question is tagged to a specification topic. Answer, mark against the mark scheme, move on.",
    },
    {
        title: "Fix what's weak",
        body: "Your marks build a mastery score per topic, so you always know exactly what to revise next.",
    },
];

const features = [
    {
        title: "Topic-level practice",
        body: "Questions organised the way the specification is, not by paper. Drill one topic until it clicks.",
    },
    {
        title: "Mastery you can see",
        body: "Recent marks, weighted toward your latest attempts, show which topics are strong and which need work.",
    },
    {
        title: "Plans that adapt",
        body: "A day-by-day plan that covers every topic before your exam, adds spaced review, and reshuffles when you fall behind.",
    },
    {
        title: "Instant marking",
        body: "Multiple choice is marked instantly. For written answers, mark yourself against the scheme, or get AI feedback point by point.",
    },
    {
        title: "Focus timer",
        body: "A built-in Pomodoro timer linked to your plan, so starting is the easy part.",
    },
    {
        title: "Built for IAL",
        body: "Edexcel International A Level units and paper codes, plus local subjects for students in the Maldives.",
    },
];

async function getStats() {
    const [subjects, topics, questions] = await Promise.all([
        db.subject.findMany({
            where: { isLocal: false },
            orderBy: { order: "asc" },
            select: { slug: true, name: true, _count: { select: { units: true } } },
        }),
        db.topic.count(),
        db.question.count({ where: { status: "PUBLISHED" } }),
    ]);
    return { subjects, topics, questions };
}

// Button fill uses the deeper terracotta so paper-coloured text meets WCAG AA (5.3:1).
const penButton =
    "lift inline-flex h-12 items-center justify-center rounded-[14px] bg-pen-deep px-6 font-book text-[0.98rem] font-semibold text-paper shadow-[0_2px_0_rgb(90_60_30/0.18)] hover:bg-[#953f20] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pen-deep";
const quietButton =
    "lift inline-flex h-12 items-center justify-center rounded-[14px] border border-ink/15 bg-paper/70 px-6 font-book text-[0.98rem] font-semibold text-ink hover:border-pen/50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pen-deep";
const navLink =
    "rounded-[10px] px-2.5 py-1 font-book text-[0.98rem] text-pencil transition-colors duration-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-pen-deep";

export default async function HomePage() {
    const [user, stats] = await Promise.all([getUser(), getStats()]);
    const primaryHref = user ? "/dashboard" : "/sign-up";

    return (
        <div
            className={cn(
                fraunces.variable,
                literata.variable,
                caveat.variable,
                "cozy grain min-h-dvh overflow-x-clip bg-parchment font-book text-ink",
            )}
        >
            {/* Evening: warm dusk around the header and hero so the lamp light around the notebook reads.
                Fades out at the bottom, so there is no seam into the next section. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] bg-[radial-gradient(ellipse_75%_70%_at_72%_38%,transparent_30%,rgb(214_190_156/0.5)_100%)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
            />
            <header className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-8">
                <Link href="/" className="display-soft text-[1.4rem] text-ink">
                    Study-IAL
                </Link>
                <nav className="ml-auto flex items-center gap-1 sm:gap-3">
                    <Link href="/subjects" className={cn(navLink, "hidden sm:inline-block")}>
                        Subjects
                    </Link>
                    {user ? (
                        <Link href="/dashboard" className={cn(penButton, "h-10 px-4 text-sm")}>
                            Open app
                        </Link>
                    ) : (
                        <>
                            <Link href="/sign-in" className={navLink}>
                                Sign in
                            </Link>
                            <Link href="/sign-up" className={cn(penButton, "h-10 px-4 text-sm")}>
                                Get started
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <main>
                {/* Hero */}
                <section>
                    <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-10 pb-20 sm:px-8 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
                        <div>
                            <h1 className="display-soft text-[2.9rem] leading-[1.02] tracking-[-0.015em] text-balance sm:text-[3.8rem] lg:text-[4.4rem]">
                                Know exactly what to revise next.
                            </h1>
                            <p className="mt-6 max-w-[34rem] text-[1.125rem] leading-[1.7] text-pretty text-pencil">
                                {site.description}
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link href={primaryHref} className={penButton}>
                                    {user ? "Go to today" : "Start practising free"}
                                </Link>
                                <Link href="/subjects" className={quietButton}>
                                    Browse the syllabus
                                </Link>
                            </div>
                            <p className="mt-10 max-w-[30rem] text-[0.98rem] leading-relaxed text-pencil">
                                Written for Edexcel International A Level:{" "}
                                <span className="font-semibold text-ink tabular-nums">{stats.topics}</span>{" "}
                                specification topics,{" "}
                                <span className="font-semibold text-ink tabular-nums">{stats.questions}</span> practice
                                questions, and it&apos;s <span className="font-semibold text-ink">free</span>.
                            </p>
                        </div>

                        <NotebookPage />
                    </div>
                </section>

                {/* How it works: a real sequence, numbered in the margin like notes */}
                <section className="border-t border-rule bg-paper-deep">
                    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
                        <h2 className="display-soft text-[2.2rem] leading-tight tracking-[-0.01em]">How it works</h2>
                        <ol className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
                            {steps.map((s, i) => (
                                <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3">
                                    <span
                                        aria-hidden
                                        className="font-hand text-[2.8rem] leading-none font-semibold text-pen-deep"
                                    >
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-[1.2rem] font-semibold">{s.title}</h3>
                                        <p className="mt-2 leading-[1.7] text-pencil-deep">{s.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-8 md:py-24 lg:grid-cols-[18rem_1fr]">
                    <h2 className="display-soft text-[2.2rem] leading-tight tracking-[-0.01em] text-balance lg:sticky lg:top-10 lg:self-start">
                        Everything revision needs, nothing it doesn&apos;t
                    </h2>
                    <ul className="grid gap-x-12 sm:grid-cols-2">
                        {features.map(({ title, body }) => (
                            <li key={title} className="border-t border-rule py-6">
                                <h3 className="text-[1.1rem] font-semibold">{title}</h3>
                                <p className="mt-2 leading-[1.7] text-pencil">{body}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Subjects as a contents page */}
                {stats.subjects.length > 0 && (
                    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-8 md:pb-24">
                        <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
                            <h2 className="display-soft text-[2.2rem] leading-tight tracking-[-0.01em]">Subjects</h2>
                            <ul className="max-w-2xl">
                                {stats.subjects.map((s) => (
                                    <li key={s.slug}>
                                        <Link
                                            href={`/subjects/${s.slug}`}
                                            className="group flex items-baseline rounded-[10px] py-2.5 text-[1.15rem] focus-visible:outline-2 focus-visible:outline-pen-deep"
                                        >
                                            <span className="font-semibold transition-colors duration-300 group-hover:text-pen-deep">
                                                {s.name}
                                            </span>
                                            <span aria-hidden className="leader" />
                                            <span className="text-[0.95rem] text-pencil tabular-nums">
                                                {s._count.units} units
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Closing call to action */}
                <section className="border-t border-rule bg-paper-deep">
                    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 md:py-24">
                        <div>
                            <h2 className="display-soft max-w-[18ch] text-[2.6rem] leading-[1.06] tracking-[-0.015em]">
                                Your next exam is closer than it looks.
                            </h2>
                            <ul className="mt-6 space-y-1 font-hand text-[1.6rem] font-medium text-pen-deep">
                                {["Free to use", "Set up in a minute"].map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <InkTick className="size-5 text-sage" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href={primaryHref} className={cn(penButton, "mt-9 h-12 px-6 text-base")}>
                            {user ? "Go to today" : "Create your free account"}
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-rule">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-pencil sm:flex-row sm:justify-between sm:px-8">
                    <span>© {new Date().getFullYear()} Study-IAL</span>
                    <span>Not affiliated with or endorsed by Pearson Edexcel.</span>
                </div>
            </footer>
        </div>
    );
}
