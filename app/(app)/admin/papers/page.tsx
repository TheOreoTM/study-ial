import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { enabledPaperSubjects, restrictedMonths } from "@/lib/papers/config";
import { requireAdmin } from "@/lib/session";
import { storage } from "@/lib/storage";

export const metadata: Metadata = { title: "Papers · Admin" };

const STATUSES = ["NONE", "QUEUED", "PARSING", "NEEDS_REVIEW", "READY", "FAILED"] as const;

export default async function AdminPapersPage() {
    await requireAdmin();
    const [byType, byStatus, sittings, uploads, broken, jobs, failedJobs, parses] = await Promise.all([
        db.$queryRaw<{ subject: string; type: string; n: bigint }[]>`
            SELECT s.subject, p.type::text AS type, count(*) AS n FROM papers p JOIN "PaperSitting" s ON s.id = p."sittingId"
            WHERE s."ownerId" IS NULL GROUP BY 1, 2`,
        db.paper.groupBy({ by: ["parseStatus"], where: { sitting: { ownerId: null } }, _count: true }),
        db.paperSitting.count({ where: { ownerId: null } }),
        db.paper.count({ where: { source: "UPLOAD" } }),
        db.paper.findMany({ where: { lastCheckOk: false }, select: { sourceUrl: true, lastCheckNote: true, lastCheckedAt: true }, take: 20 }),
        db.paperJob.groupBy({ by: ["status"], _count: true }),
        db.paperJob.findMany({ where: { status: "FAILED" }, orderBy: { updatedAt: "desc" }, take: 10, select: { id: true, paperId: true, error: true, updatedAt: true } }),
        db.paperParse.groupBy({ by: ["engine", "docType"], _count: true }),
    ]);
    const count = (subject: string, type: string) => Number(byType.find((r) => r.subject === subject && r.type === type)?.n ?? 0);
    const checked = await db.paper.count({ where: { lastCheckedAt: { not: null } } });

    return (
        <>
            <PageHeader
                title="Past papers"
                description={`Storage: ${storage().kind}. Restricted window: ${restrictedMonths()} months. Run pnpm papers:ingest, papers:parse and papers:check-links from a machine with the production environment.`}
            />
            <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border bg-card p-5 shadow-card">
                    <h2 className="mb-3 text-lg">Index</h2>
                    <p className="mb-3 text-muted-foreground">
                        <span className="num text-foreground">{sittings}</span> sittings · <span className="num text-foreground">{uploads}</span> student uploads
                    </p>
                    <table className="w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                            <tr>
                                <th className="py-1 font-semibold">Subject</th>
                                <th className="font-semibold">QP</th>
                                <th className="font-semibold">MS</th>
                                <th className="font-semibold">ER</th>
                            </tr>
                        </thead>
                        <tbody className="num">
                            {enabledPaperSubjects().map((s) => (
                                <tr key={s.slug} className="border-t">
                                    <td className="py-1.5 font-sans font-semibold">{s.name}</td>
                                    <td>{count(s.slug, "QP")}</td>
                                    <td>{count(s.slug, "MS")}</td>
                                    <td>{count(s.slug, "ER")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className="rounded-xl border bg-card p-5 shadow-card">
                    <h2 className="mb-3 text-lg">Parsing</h2>
                    <dl className="grid grid-cols-3 gap-2 text-sm">
                        {STATUSES.map((st) => (
                            <div key={st} className="rounded-lg bg-muted p-3">
                                <dt className="text-muted-foreground">{st.replace("_", " ").toLowerCase()}</dt>
                                <dd className="num font-display text-xl font-extrabold">{byStatus.find((b) => b.parseStatus === st)?._count ?? 0}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Jobs: {jobs.map((j) => `${j._count} ${j.status.toLowerCase()}`).join(" · ") || "none"} · Cached parses:{" "}
                        {parses.map((p) => `${p._count} ${p.docType} (${p.engine})`).join(", ") || "none"}
                    </p>
                </section>
                <section className="rounded-xl border bg-card p-5 shadow-card">
                    <h2 className="mb-3 text-lg">Source links</h2>
                    <p className="text-muted-foreground">
                        {checked} checked · <span className={broken.length ? "font-bold text-destructive" : ""}>{broken.length} broken</span>
                    </p>
                    {broken.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm">
                            {broken.map((b) => (
                                <li key={b.sourceUrl} className="truncate">
                                    <span className="font-semibold">{b.lastCheckNote}</span> · {b.sourceUrl}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section className="rounded-xl border bg-card p-5 shadow-card">
                    <h2 className="mb-3 text-lg">Failed jobs</h2>
                    {failedJobs.length === 0 ? (
                        <p className="text-muted-foreground">None.</p>
                    ) : (
                        <ul className="space-y-1.5 text-sm">
                            {failedJobs.map((j) => (
                                <li key={j.id}>
                                    <span className="font-semibold">{j.paperId}</span> · {j.error?.slice(0, 160)}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}
