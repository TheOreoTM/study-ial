import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { TAKEDOWN_EMAIL } from "@/lib/papers/config";

export const metadata: Metadata = {
    title: "Copyright and takedown",
    description: "How Study-IAL handles Pearson past papers, and how to ask for material to be removed.",
};

export default function TakedownPage() {
    return (
        <div className="max-w-2xl">
            <PageHeader title="Copyright and takedown" />
            <div className="space-y-4 text-[1.0625rem]">
                <p>
                    Past papers, mark schemes and examiner reports are © Pearson Education Ltd. Study-IAL only indexes papers
                    Pearson makes openly available on its website, keeps them unmodified (copyright pages included), and shows
                    them only to signed-in students for personal study. Papers from the most recent series, which Pearson
                    restricts to exam centres, are never collected.
                </p>
                <p>
                    Files are held in private storage and are never public, never in search results and never in our sitemap.
                    Public pages show only which sittings exist. Study-IAL is free and is not affiliated with or endorsed by
                    Pearson.
                </p>
                <p>
                    If you hold rights in material on this site and want it removed, email{" "}
                    <a href={`mailto:${TAKEDOWN_EMAIL}`} className="font-bold text-selected-foreground underline decoration-2 underline-offset-4">
                        {TAKEDOWN_EMAIL}
                    </a>{" "}
                    with the paper (unit and series) or the page address. We remove material promptly, usually within two
                    working days, and can switch any subject to link to Pearson&apos;s own copy instead of ours.
                </p>
                <p className="text-muted-foreground">
                    Automated requests from our indexer identify themselves as <code>StudyIAL-PaperIndexer</code>, respect
                    robots.txt and are rate-limited.
                </p>
            </div>
        </div>
    );
}
