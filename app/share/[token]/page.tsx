import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { StudyHeatmap } from "@/components/analytics/study-heatmap";
import { MasteryBar, MasteryBreakdown, MasteryTile, summarizeMastery } from "@/components/mastery";
import { GradeTile } from "@/components/mock/grade-tile";
import { UnitChip } from "@/components/plans/unit-chip";
import { db } from "@/lib/db";
import { masteryLabel, masteryTone } from "@/lib/mastery";
import { indicativeGrade, MOCK_LENGTH_LABEL, type MockLength } from "@/lib/mock-exam";
import { getStudyHeatmap } from "@/lib/queries/heatmap";
import { getTopicMastery } from "@/lib/queries/mastery";
import { daysUntil } from "@/lib/queries/plans";
import { hashShareToken, isShareTokenShaped, shareDisplayName } from "@/lib/share";
import { APP_TIME_ZONE } from "@/lib/time";
import { cn } from "@/lib/utils";

// A private page reached by a secret link: never indexed, and the token never leaks in a Referer header.
export const metadata: Metadata = {
    title: "Shared progress",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
};

type Params = Promise<{ token: string }>;

const HOUR = 3_600_000;

async function findShare(token: string) {
    if (!isShareTokenShaped(token)) return null;
    return db.progressShare.findUnique({
        where: { tokenHash: hashShareToken(token) },
        select: { userId: true, lastViewed: true, user: { select: { name: true } } },
    });
}

export default async function SharedProgressPage({ params }: { params: Params }) {
    const { token } = await params;
    const share = await findShare(token);
    if (!share) notFound();
    const userId = share.userId;
    const now = new Date();

    // "Last opened" for the student, at most once an hour, after the page is sent.
    if (!share.lastViewed || now.getTime() - share.lastViewed.getTime() > HOUR) {
        after(() => db.progressShare.updateMany({ where: { userId }, data: { lastViewed: new Date() } }).catch(() => {}));
    }

    const userUnits = await db.userUnit.findMany({
        where: { userId },
        include: { unit: { include: { topics: { orderBy: { order: "asc" }, select: { id: true, code: true, name: true } } } } },
        orderBy: [{ examDate: { sort: "asc", nulls: "last" } }, { unit: { order: "asc" } }],
    });
    const topicIds = userUnits.flatMap((uu) => uu.unit.topics.map((t) => t.id));
    const [mastery, mocks, heatmap] = await Promise.all([
        getTopicMastery(userId, topicIds),
        db.mockExam.findMany({
            where: { userId, status: "FINISHED" },
            orderBy: { finishedAt: "desc" },
            take: 5,
            select: { id: true, length: true, finishedAt: true, marksAwarded: true, totalMarks: true, unit: { select: { code: true } } },
        }),
        getStudyHeatmap(userId, { weeks: 26, now }),
    ]);
    const name = shareDisplayName(share.user.name);
    const lastWeek = heatmap.weeks.flat().filter((c) => !c.future).slice(-7);
    const weekQuestions = lastWeek.reduce((n, c) => n + c.questions, 0);
    const weekMinutes = lastWeek.reduce((n, c) => n + c.minutes, 0);
    const weekDays = lastWeek.filter((c) => c.level > 0).length;

    return (
        <>
                <h1 className="text-[1.75rem] leading-[1.1] sm:text-[2.125rem]">{name}&apos;s progress</h1>
                <p className="mt-2 max-w-2xl text-[1.0625rem] text-muted-foreground">
                    Shared by {name} from Study-IAL. Mastery comes from their own recent marks on practice questions in
                    each topic. Updated {formatNow(now)}.
                </p>

                <section aria-label="This week" className="mt-8 grid grid-cols-3 gap-3">
                    <Stat label="Days studied" value={weekDays} hint="last 7 days" />
                    <Stat label="Questions" value={weekQuestions} hint="last 7 days" />
                    <Stat label="Focus" value={`${Math.round(weekMinutes / 6) / 10} h`} hint="last 7 days" />
                </section>

                <div className="mt-8 grid gap-6">
                    {userUnits.length === 0 ? (
                        <p className="rounded-xl bg-muted p-5 text-muted-foreground">No units added yet.</p>
                    ) : (
                        userUnits.map(({ unit, examDate }) => {
                            const ms = unit.topics.map((t) => mastery.get(t.id)!);
                            const summary = summarizeMastery(ms);
                            const days = examDate ? daysUntil(examDate, now) : null;
                            const pct = summary.score === null ? null : Math.round(summary.score * 100);
                            return (
                                <section
                                    key={unit.id}
                                    aria-labelledby={`u-${unit.id}`}
                                    className="rounded-xl border bg-card p-5 shadow-card sm:p-6"
                                >
                                    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <UnitChip code={unit.code} />
                                        <h2 id={`u-${unit.id}`} className="min-w-0 flex-1 text-lg leading-tight">
                                            {unit.name}
                                        </h2>
                                        <span className="w-full text-sm font-bold text-muted-foreground sm:w-auto">
                                            {days === null
                                                ? "No exam date"
                                                : days < 0
                                                  ? "Exam passed"
                                                  : `Exam in ${days} day${days === 1 ? "" : "s"}`}
                                        </span>
                                    </div>
                                    <div className="mb-4 flex items-end justify-between gap-3">
                                        <p className={cn("num text-[2rem] leading-none", masteryTone[summary.level].text)}>
                                            {pct === null ? "–" : `${pct}%`}
                                        </p>
                                        <p className="text-right text-sm text-muted-foreground">
                                            <span className="num text-foreground">{summary.started}</span> of{" "}
                                            {summary.topics} topics practised
                                        </p>
                                    </div>
                                    {summary.started > 0 && <MasteryBreakdown counts={summary.counts} className="mb-5" />}
                                    <ul className="grid gap-2 sm:grid-cols-2">
                                        {unit.topics.map((t) => {
                                            const m = mastery.get(t.id)!;
                                            return (
                                                <li key={t.id} className="flex items-center gap-3 rounded-lg bg-muted p-2.5 pr-3.5">
                                                    <MasteryTile code={t.code} level={m.level} size="sm" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-[0.9375rem] font-bold">{t.name}</p>
                                                        <MasteryBar level={m.level} score={m.score} label={t.name} className="mt-1.5" />
                                                    </div>
                                                    <span className={cn("shrink-0 text-xs font-extrabold tracking-[0.05em] uppercase", masteryTone[m.level].text)}>
                                                        {masteryLabel[m.level]}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            );
                        })
                    )}

                    {mocks.length > 0 && (
                        <section aria-labelledby="mocks" className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
                            <h2 id="mocks" className="mb-3 text-lg">
                                Recent mock papers
                            </h2>
                            <ul className="grid gap-2">
                                {mocks.map((p) => (
                                    <li key={p.id} className="flex items-center gap-3 rounded-lg bg-muted px-3.5 py-2.5">
                                        <GradeTile grade={indicativeGrade(p.marksAwarded ?? 0, p.totalMarks)} />
                                        <p className="min-w-0 flex-1">
                                            <span className="block font-bold">
                                                {p.unit.code} · {MOCK_LENGTH_LABEL[p.length as MockLength] ?? "Paper"}
                                            </span>
                                            <span className="text-[0.8125rem] text-muted-foreground">
                                                {p.finishedAt && formatDay(p.finishedAt)}
                                            </span>
                                        </p>
                                        <span className="num shrink-0">
                                            {p.marksAwarded}/{p.totalMarks}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                                Grades are estimates from uniform-mark thresholds on original practice questions, not
                                past papers.
                            </p>
                        </section>
                    )}

                    <StudyHeatmap map={heatmap} />
                </div>

                <p className="mt-10 text-sm text-muted-foreground">
                    {name} can turn this link off at any time in their Study-IAL settings.
                </p>
        </>
    );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint: string }) {
    return (
        <div className="rounded-xl border bg-card p-4 sm:px-5">
            <p className="text-[0.8125rem] font-bold text-muted-foreground">{label}</p>
            <p className="num mt-1.5 text-[1.75rem] leading-none">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
    );
}

function formatDay(d: Date) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: APP_TIME_ZONE });
}

function formatNow(d: Date) {
    return d.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: APP_TIME_ZONE,
    });
}
