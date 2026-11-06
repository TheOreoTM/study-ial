import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { aiEnabled, dailyLimit, type AiFeature } from "@/lib/ai";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "AI spend · Admin" };

const FEATURES: AiFeature[] = ["marking", "tutor", "parse", "plan", "generate"];
const daysAgo = (n: number) => new Date(new Date().getTime() - n * 86_400_000);
const usd = (micros: number) => `$${(micros / 1e6).toFixed(micros < 10_000_000 ? 3 : 2)}`;

export default async function AiSpendPage() {
    await requireAdmin();
    const since = daysAgo(30);
    const [byFeature, byModel, byDay, topUsers] = await Promise.all([
        db.aiCallLog.groupBy({ by: ["feature"], where: { createdAt: { gte: since } }, _sum: { costMicros: true, inputTokens: true, outputTokens: true }, _count: true }),
        db.aiCallLog.groupBy({ by: ["model"], where: { createdAt: { gte: since } }, _sum: { costMicros: true }, _count: true }),
        db.$queryRaw<{ day: Date; cost: bigint; calls: bigint }[]>`
            SELECT date_trunc('day', "createdAt") AS day, sum("costMicros") AS cost, count(*) AS calls
            FROM "AiCallLog" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1 DESC LIMIT 30`,
        db.aiCallLog.groupBy({
            by: ["userId"],
            where: { createdAt: { gte: since }, userId: { not: null } },
            _sum: { costMicros: true },
            _count: true,
            orderBy: { _sum: { costMicros: "desc" } },
            take: 10,
        }),
    ]);
    const total = byFeature.reduce((a, f) => a + (f._sum.costMicros ?? 0), 0);
    const failed = await db.aiCallLog.count({ where: { createdAt: { gte: since }, ok: false } });
    const names = new Map(
        (await db.user.findMany({ where: { id: { in: topUsers.map((u) => u.userId!) } }, select: { id: true, name: true } })).map((u) => [u.id, u.name]),
    );

    return (
        <>
            <PageHeader
                title="AI spend"
                description={`Last 30 days. Costs are estimates from token counts. AI is ${aiEnabled ? "on" : "off (no OPENROUTER_API_KEY)"}.`}
            />
            <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border bg-card p-5 shadow-card">
                    <p className="num font-display text-4xl font-extrabold">{usd(total)}</p>
                    <p className="text-muted-foreground">
                        {byFeature.reduce((a, f) => a + f._count, 0)} calls · {failed} failed
                    </p>
                    <table className="mt-4 w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                            <tr>
                                <th className="py-1 font-semibold">Feature</th>
                                <th className="font-semibold">Calls</th>
                                <th className="font-semibold">Tokens in/out</th>
                                <th className="font-semibold">Cost</th>
                                <th className="font-semibold">Daily cap</th>
                            </tr>
                        </thead>
                        <tbody className="num">
                            {FEATURES.map((f) => {
                                const row = byFeature.find((r) => r.feature === f);
                                return (
                                    <tr key={f} className="border-t">
                                        <td className="py-1.5 font-sans font-semibold">{f}</td>
                                        <td>{row?._count ?? 0}</td>
                                        <td>
                                            {(row?._sum.inputTokens ?? 0).toLocaleString()} / {(row?._sum.outputTokens ?? 0).toLocaleString()}
                                        </td>
                                        <td>{usd(row?._sum.costMicros ?? 0)}</td>
                                        <td>{dailyLimit(f)} per user</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
                <section className="rounded-xl border bg-card p-5 shadow-card">
                    <h2 className="mb-3 text-lg">By model</h2>
                    <ul className="space-y-1 text-sm">
                        {byModel.length === 0 && <li className="text-muted-foreground">No calls yet.</li>}
                        {byModel.map((m) => (
                            <li key={m.model} className="flex justify-between gap-2">
                                <span className="truncate font-semibold">{m.model}</span>
                                <span className="num">
                                    {m._count} · {usd(m._sum.costMicros ?? 0)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <h2 className="mt-5 mb-3 text-lg">Heaviest users</h2>
                    <ul className="space-y-1 text-sm">
                        {topUsers.length === 0 && <li className="text-muted-foreground">No calls yet.</li>}
                        {topUsers.map((u) => (
                            <li key={u.userId} className="flex justify-between gap-2">
                                <span className="truncate">{names.get(u.userId!) ?? u.userId}</span>
                                <span className="num">
                                    {u._count} · {usd(u._sum.costMicros ?? 0)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
                    <h2 className="mb-3 text-lg">By day</h2>
                    {byDay.length === 0 ? (
                        <p className="text-muted-foreground">No calls yet.</p>
                    ) : (
                        <ul className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                            {byDay.map((d) => (
                                <li key={String(d.day)} className="flex justify-between rounded-md bg-muted px-3 py-1.5">
                                    <span>{new Date(d.day).toISOString().slice(0, 10)}</span>
                                    <span className="num">
                                        {Number(d.calls)} · {usd(Number(d.cost))}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}
