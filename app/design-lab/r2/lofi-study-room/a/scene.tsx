// Authored illustrations for the lo-fi study room: the dusk window, the pendant lamp and the tape reels.
// Decorative only — every one is aria-hidden; the meaning lives in the surrounding text.

import styles from "./page.module.css";

export function DuskWindow() {
    return (
        <svg className={styles.windowArt} viewBox="0 0 440 520" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="lsra-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3A2948" />
                    <stop offset="0.16" stopColor="#7A4258" />
                    <stop offset="0.32" stopColor="#C8664B" />
                    <stop offset="0.4" stopColor="#E7A85A" />
                </linearGradient>
                <linearGradient id="lsra-sea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5A3A55" />
                    <stop offset="1" stopColor="#2A1F38" />
                </linearGradient>
                <radialGradient id="lsra-sun" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#FFE2A3" />
                    <stop offset="0.6" stopColor="#F5C36B" />
                    <stop offset="1" stopColor="#F5C36B" stopOpacity="0" />
                </radialGradient>
                <clipPath id="lsra-pane">
                    <path d="M40 220 A180 180 0 0 1 400 220 V480 H40 Z" />
                </clipPath>
            </defs>

            <path d="M20 220 A200 200 0 0 1 420 220 V500 H20 Z" fill="#22172A" />

            <g clipPath="url(#lsra-pane)">
                <rect x="40" y="40" width="360" height="440" fill="url(#lsra-sky)" />
                <g fill="#F7E3C4">
                    <circle cx="112" cy="128" r="1.6" opacity="0.8" />
                    <circle cx="300" cy="96" r="1.2" opacity="0.7" />
                    <circle cx="352" cy="160" r="1.8" opacity="0.85" />
                    <circle cx="180" cy="84" r="1.1" opacity="0.6" />
                    <circle cx="248" cy="150" r="1.3" opacity="0.55" />
                </g>
                <path d="M318 118 a20 20 0 1 0 22 26 a16 16 0 1 1 -22 -26 Z" fill="#F7E3C4" opacity="0.9" />
                <g fill="#E89A72" opacity="0.45">
                    <rect x="70" y="150" width="120" height="10" rx="5" />
                    <rect x="98" y="166" width="84" height="8" rx="4" />
                    <rect x="262" y="180" width="100" height="9" rx="4.5" />
                </g>
                <g transform="translate(0 -70)">
                    <circle cx="250" cy="282" r="70" fill="url(#lsra-sun)" />
                    <circle cx="250" cy="282" r="34" fill="#FBD58A" />
                    <rect x="40" y="282" width="360" height="270" fill="url(#lsra-sea)" />
                    <g stroke="#F3B66A" strokeLinecap="round" opacity="0.7">
                        <line x1="214" y1="296" x2="286" y2="296" strokeWidth="3" />
                        <line x1="226" y1="310" x2="274" y2="310" strokeWidth="2.5" />
                        <line x1="236" y1="324" x2="264" y2="324" strokeWidth="2" />
                        <line x1="244" y1="338" x2="256" y2="338" strokeWidth="2" />
                    </g>
                    <path d="M50 300 Q110 270 176 300 Z" fill="#1E1526" />
                    <path
                        d="M118 292 C116 256 108 226 96 198"
                        stroke="#1E1526"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <g fill="#1E1526">
                        <path d="M96 198 C82 182 60 180 44 190 C62 186 80 190 96 202 Z" />
                        <path d="M96 198 C104 178 124 170 144 176 C124 178 108 188 98 204 Z" />
                        <path d="M96 198 C88 176 70 164 52 164 C70 172 84 184 94 204 Z" />
                        <path d="M96 198 C112 188 136 192 150 206 C132 198 114 198 98 204 Z" />
                        <path d="M96 198 C96 180 104 162 116 152 C108 168 102 184 100 204 Z" />
                    </g>
                </g>
            </g>

            <g fill="none" stroke="#4E3354" strokeWidth="10" strokeLinejoin="round">
                <path d="M40 220 A180 180 0 0 1 400 220 V480 H40 Z" />
                <line x1="220" y1="40" x2="220" y2="480" />
                <line x1="40" y1="300" x2="400" y2="300" />
            </g>
            <rect x="14" y="478" width="412" height="22" rx="11" fill="#5A3B5E" />
            <rect x="14" y="478" width="412" height="6" rx="3" fill="#6E4A70" />
        </svg>
    );
}

export function PendantLamp() {
    return (
        <svg className={styles.lampArt} viewBox="0 0 120 170" aria-hidden="true" focusable="false">
            <line x1="60" y1="0" x2="60" y2="74" stroke="#5A3B5E" strokeWidth="3" />
            <rect x="52" y="70" width="16" height="12" rx="4" fill="#5A3B5E" />
            <path d="M22 132 C22 104 38 82 60 82 C82 82 98 104 98 132 Z" fill="#D0714F" />
            <path d="M22 132 C22 104 38 82 60 82 C50 88 40 106 38 132 Z" fill="#E0886A" opacity="0.6" />
            <ellipse cx="60" cy="134" rx="38" ry="6" fill="#A9502F" />
            <ellipse cx="60" cy="137" rx="16" ry="7" fill="#FFE2A3" />
        </svg>
    );
}

export function Reel({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="22" fill="#F5E7D6" />
            <circle cx="24" cy="24" r="15" fill="#3A2740" />
            <circle cx="24" cy="24" r="7" fill="#F5E7D6" />
            <g fill="#3A2740">
                <rect x="22" y="15.5" width="4" height="5" rx="1" />
                <rect x="22" y="15.5" width="4" height="5" rx="1" transform="rotate(120 24 24)" />
                <rect x="22" y="15.5" width="4" height="5" rx="1" transform="rotate(240 24 24)" />
            </g>
        </svg>
    );
}

function CassetteReel({ cx }: { cx: number }) {
    return (
        <g className={styles.cassetteReel}>
            <circle cx={cx} cy="98" r="21" fill="#F5E7D6" />
            <circle cx={cx} cy="98" r="14" fill="#3A2740" />
            <circle cx={cx} cy="98" r="6.5" fill="#F5E7D6" />
            <g fill="#3A2740">
                <rect x={cx - 2} y="89" width="4" height="5" rx="1" />
                <rect x={cx - 2} y="89" width="4" height="5" rx="1" transform={`rotate(120 ${cx} 98)`} />
                <rect x={cx - 2} y="89" width="4" height="5" rx="1" transform={`rotate(240 ${cx} 98)`} />
            </g>
        </g>
    );
}

/** The tape itself, now small: it sits on the deck label instead of between the label and the tracklist. */
export function Cassette() {
    return (
        <svg className={styles.cassette} viewBox="0 0 320 196" aria-hidden="true" focusable="false">
            <rect x="4" y="4" width="312" height="188" rx="18" fill="#5A3B5E" />
            <rect x="4" y="4" width="312" height="188" rx="18" fill="none" stroke="#6E4A70" strokeWidth="2" />
            <rect x="24" y="20" width="272" height="112" rx="10" fill="#D0714F" />
            <rect x="24" y="20" width="272" height="22" rx="10" fill="#E2AE4A" />
            <rect x="24" y="34" width="272" height="8" fill="#E2AE4A" />
            <rect x="72" y="70" width="176" height="56" rx="28" fill="#1F1523" />
            <rect x="110" y="84" width="100" height="28" rx="3" fill="#5B3A2C" />
            <CassetteReel cx={110} />
            <CassetteReel cx={210} />
            <path d="M74 192 L90 150 H230 L246 192 Z" fill="#4B3150" />
            <circle cx="122" cy="174" r="5" fill="#2A1D2E" />
            <circle cx="198" cy="174" r="5" fill="#2A1D2E" />
            <rect x="150" y="164" width="20" height="12" rx="3" fill="#2A1D2E" />
        </svg>
    );
}

/** A small plant standing on the shelf board beside the subjects heading. */
export function PottedPlant() {
    return (
        <svg className={styles.plant} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
            <g fill="#94B59E">
                <path d="M60 96 C40 80 30 56 34 30 C48 46 58 68 60 96 Z" />
                <path d="M60 96 C78 78 90 58 92 36 C76 48 64 70 60 96 Z" opacity="0.85" />
                <path d="M60 98 C42 94 22 80 14 62 C34 64 50 76 60 98 Z" opacity="0.75" />
                <path d="M60 98 C80 96 98 86 108 70 C88 70 70 80 60 98 Z" opacity="0.7" />
                <path d="M60 96 C58 70 60 44 68 20 C74 44 70 70 60 96 Z" opacity="0.9" />
            </g>
            <path d="M30 98 H90 L84 146 H36 Z" fill="#D0714F" />
            <rect x="26" y="94" width="68" height="12" rx="5" fill="#A9502F" />
        </svg>
    );
}
