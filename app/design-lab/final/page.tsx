import type { Metadata } from "next";
import { FinalViewer } from "./viewer";

export const metadata: Metadata = { title: "Design lab · Final", robots: { index: false } };

const picks = [
    {
        key: "night-desk",
        style: "Night Desk",
        version: "B — Pushed",
        src: "/design-lab/r2/night-desk/b",
        note: "Warm dark desk at night: walnut desk top, lamp beam on the weak topic, amber only where it matters.",
    },
    {
        key: "lofi-study-room",
        style: "Lo-fi Study Room",
        version: "A — Refined",
        src: "/design-lab/r2/lofi-study-room/a",
        note: "Dusk-to-night plum room with the cassette-deck tracklist, cued weak track, and sunset horizon.",
    },
    {
        key: "playful-pop",
        style: "Playful Pop",
        version: "B — Pushed",
        src: "/design-lab/r2/playful-pop/b",
        note: "Bright tangerine and purple, rising-bars skyline, game-board level path; colours mean mastery.",
    },
];

export default function FinalPage() {
    return <FinalViewer picks={picks} />;
}
