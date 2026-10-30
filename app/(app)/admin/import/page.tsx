import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ImportForm } from "@/components/admin/import-form";
import { ImportHelp } from "@/components/admin/import-help";
import { requireAdmin } from "@/lib/session";
import { getCurriculumTree } from "../queries";

export const metadata: Metadata = { title: "Import questions · Admin" };

export default async function ImportPage() {
    await requireAdmin();
    const tree = await getCurriculumTree();
    const units = tree.flatMap((s) =>
        s.units.map((u) => ({
            code: u.code,
            name: u.name,
            subject: s.name,
            topics: u.topics.map((t) => ({ slug: t.slug, code: t.code, name: t.name })),
        })),
    );

    return (
        <>
            <PageHeader
                title="Import questions"
                description="Paste or upload a JSON array of questions. Every row is validated before anything is written; rows with a seedKey are updated in place on re-import."
                className="mb-6"
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                <ImportForm />
                <ImportHelp units={units} />
            </div>
        </>
    );
}
