import type { Metadata } from "next";
import { styles } from "@/design-lab/content";
import { DesignLabViewer } from "./viewer";

export const metadata: Metadata = { title: "Design lab", robots: { index: false } };

export default async function DesignLabPage({ searchParams }: { searchParams: Promise<{ style?: string }> }) {
    const { style } = await searchParams;
    const initial = Math.max(
        0,
        styles.findIndex((s) => s.slug === style),
    );
    return <DesignLabViewer styles={styles.map((s) => ({ ...s }))} initialIndex={initial} />;
}
