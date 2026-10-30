import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getFocusStats } from "@/lib/queries/focus";
import { PageHeader } from "@/components/page-header";
import { FocusStatsCard } from "@/components/focus/focus-stats";
import { FocusTimer } from "@/components/focus/focus-timer";
import type { FocusTask, FocusTopic, FocusTopicGroup } from "@/components/focus/types";
import { logFocusSession, markFocusTaskDone } from "./actions";

export const metadata: Metadata = { title: "Focus" };

const topicSelect = { id: true, code: true, name: true, unit: { select: { code: true } } } as const;

function toFocusTopic(t: { id: string; code: string; name: string; unit: { code: string } }): FocusTopic {
    return { id: t.id, code: t.code, name: t.name, unitCode: t.unit.code };
}

export default async function FocusPage({ searchParams }: { searchParams: Promise<{ task?: string; topic?: string }> }) {
    const user = await requireUser();
    const params = await searchParams;
    const taskId = typeof params.task === "string" ? params.task : undefined;
    const topicId = typeof params.topic === "string" ? params.topic : undefined;

    const [taskRow, topicRow, myUnits, stats] = await Promise.all([
        taskId
            ? db.studyPlanTask.findFirst({
                  where: { id: taskId, plan: { userId: user.id } },
                  select: { id: true, title: true, status: true, topic: { select: topicSelect } },
              })
            : null,
        topicId ? db.topic.findUnique({ where: { id: topicId }, select: topicSelect }) : null,
        db.userUnit.findMany({
            where: { userId: user.id },
            orderBy: { unit: { order: "asc" } },
            select: {
                unit: {
                    select: {
                        code: true,
                        name: true,
                        topics: { orderBy: { order: "asc" }, select: topicSelect },
                    },
                },
            },
        }),
        getFocusStats(user.id),
    ]);

    const task: FocusTask | null = taskRow
        ? {
              id: taskRow.id,
              title: taskRow.title,
              done: taskRow.status === "DONE",
              topic: taskRow.topic ? toFocusTopic(taskRow.topic) : null,
          }
        : null;
    const topicGroups: FocusTopicGroup[] = myUnits
        .filter((u) => u.unit.topics.length > 0)
        .map((u) => ({ unitCode: u.unit.code, unitName: u.unit.name, topics: u.unit.topics.map(toFocusTopic) }));

    return (
        <div>
            <PageHeader
                title="Focus"
                description="Work in calm, timed blocks. Finished focus sessions are logged to your streak."
            />
            {taskId && !task && (
                <p role="alert" className="mb-4 rounded-lg border px-4 py-3 text-sm text-muted-foreground">
                    That study-plan task couldn&apos;t be found, so this session isn&apos;t linked to it.
                </p>
            )}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                <FocusTimer
                    task={task}
                    initialTopic={topicRow ? toFocusTopic(topicRow) : null}
                    topicGroups={topicGroups}
                    logSession={logFocusSession}
                    markTaskDone={markFocusTaskDone}
                />
                <FocusStatsCard stats={stats} />
            </div>
        </div>
    );
}
