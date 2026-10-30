import type { Metadata } from "next";
import { R2Viewer } from "./viewer";

export const metadata: Metadata = { title: "Design lab · Round 2", robots: { index: false } };

const styles = [
    { slug: "night-desk", name: "Night Desk", description: "Warm dark mode, espresso browns and amber light." },
    { slug: "lofi-study-room", name: "Lo-fi Study Room", description: "Warm dusk, lamp glow, terracotta, plum and mustard." },
    { slug: "playful-pop", name: "Playful Pop", description: "Bright, chunky, colourful; energetic." },
];

export default async function R2Page({ searchParams }: { searchParams: Promise<{ style?: string }> }) {
    const { style } = await searchParams;
    const initial = Math.max(
        0,
        styles.findIndex((s) => s.slug === style),
    );
    return <R2Viewer styles={styles} initialIndex={initial} />;
}
