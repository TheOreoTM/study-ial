import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, CalendarCheck, CheckCircle2, Sparkles, Target, Timer } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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
        icon: Target,
        title: "Topic-level practice",
        body: "Questions organised the way the specification is, not by paper. Drill one topic until it clicks.",
    },
    {
        icon: BarChart3,
        title: "Mastery you can see",
        body: "Recent marks, weighted toward your latest attempts, show which topics are strong and which need work.",
    },
    {
        icon: CalendarCheck,
        title: "Plans that adapt",
        body: "A day-by-day plan that covers every topic before your exam, adds spaced review, and reshuffles when you fall behind.",
    },
    {
        icon: Sparkles,
        title: "Instant marking",
        body: "Multiple choice is marked instantly. For written answers, mark yourself against the scheme, or get AI feedback point by point.",
    },
    {
        icon: Timer,
        title: "Focus timer",
        body: "A built-in Pomodoro timer linked to your plan, so starting is the easy part.",
    },
    {
        icon: BookOpenCheck,
        title: "Built for IAL",
        body: "Edexcel International A Level units and paper codes, plus local subjects for students in the Maldives.",
    },
];

// Static illustration of the product (not live data).
const preview = [
    { code: "1.1", name: "Motion and kinematics", score: 86, tone: "bg-success" },
    { code: "1.3", name: "Momentum", score: 71, tone: "bg-warning" },
    { code: "1.5", name: "Density, upthrust and viscosity", score: 38, tone: "bg-destructive" },
    { code: "1.6", name: "Hooke's law, stress and strain", score: 64, tone: "bg-warning" },
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

export default async function HomePage() {
    const [user, stats] = await Promise.all([getUser(), getStats()]);
    const primaryHref = user ? "/dashboard" : "/sign-up";

    return (
        <div className="min-h-dvh">
            <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
                    <Logo />
                    <nav className="ml-auto flex items-center gap-1 sm:gap-2">
                        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                            <Link href="/subjects">Subjects</Link>
                        </Button>
                        {user ? (
                            <Button asChild size="sm">
                                <Link href="/dashboard">Open app</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/sign-in">Sign in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/sign-up">Get started</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr]">
                    <div>
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-primary" />
                            For Edexcel International A Level
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            Know exactly what to revise next.
                        </h1>
                        <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">{site.description}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <Link href={primaryHref}>
                                    {user ? "Go to today" : "Start practising free"}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/subjects">Browse the syllabus</Link>
                            </Button>
                        </div>
                        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Specification topics</dt>
                                <dd className="text-2xl font-semibold tabular-nums">{stats.topics}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Practice questions</dt>
                                <dd className="text-2xl font-semibold tabular-nums">{stats.questions}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Price</dt>
                                <dd className="text-2xl font-semibold">Free</dd>
                            </div>
                        </dl>
                    </div>

                    <div aria-hidden className="relative">
                        <div className="rounded-2xl border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">WPH11 · Unit 1</p>
                                    <p className="font-semibold">Mechanics and Materials</p>
                                </div>
                                <span className="shrink-0 whitespace-nowrap rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                                    Exam in 74 days
                                </span>
                            </div>
                            <ul className="space-y-3">
                                {preview.map((t) => (
                                    <li key={t.code} className="rounded-lg border p-3">
                                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                            <span className="truncate">
                                                <span className="mr-2 font-mono text-xs text-muted-foreground">{t.code}</span>
                                                {t.name}
                                            </span>
                                            <span className="font-medium tabular-nums">{t.score}%</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div className={cn("h-full rounded-full", t.tone)} style={{ width: `${t.score}%` }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/60 p-3 text-sm">
                                <Target className="size-4 shrink-0 text-primary" />
                                <span>
                                    Next up: <span className="font-medium">Density, upthrust and viscosity</span> — 10
                                    questions
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="border-y bg-card/50">
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
                        <ol className="mt-8 grid gap-8 md:grid-cols-3">
                            {steps.map((s, i) => (
                                <li key={s.title}>
                                    <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                        {i + 1}
                                    </span>
                                    <h3 className="mt-4 font-medium">{s.title}</h3>
                                    <p className="mt-1.5 text-muted-foreground">{s.body}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
                    <h2 className="text-2xl font-semibold tracking-tight">Everything revision needs, nothing it doesn&apos;t</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map(({ icon: Icon, title, body }) => (
                            <div key={title} className="rounded-xl border bg-card p-5">
                                <Icon className="size-5 text-primary" />
                                <h3 className="mt-3 font-medium">{title}</h3>
                                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Subjects */}
                {stats.subjects.length > 0 && (
                    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                        <h2 className="text-2xl font-semibold tracking-tight">Subjects</h2>
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {stats.subjects.map((s) => (
                                <li key={s.slug}>
                                    <Link
                                        href={`/subjects/${s.slug}`}
                                        className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm hover:border-primary/50"
                                    >
                                        {s.name}
                                        <span className="text-xs text-muted-foreground">{s._count.units} units</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* CTA */}
                <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
                    <div className="flex flex-col items-start gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Your next exam is closer than it looks.</h2>
                            <ul className="mt-3 space-y-1 text-sm opacity-90">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4" /> Free to use
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4" /> Set up in a minute
                                </li>
                            </ul>
                        </div>
                        <Button asChild size="lg" variant="secondary">
                            <Link href={primaryHref}>
                                {user ? "Go to today" : "Create your free account"}
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
                    <span>© {new Date().getFullYear()} Study-IAL</span>
                    <span>Not affiliated with or endorsed by Pearson Edexcel.</span>
                </div>
            </footer>
        </div>
    );
}
