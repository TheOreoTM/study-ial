type P = { className?: string };

/** Clip-on desk lamp. The shade mouth sits at (80, 98) in viewBox units; the beam is aimed from there. */
export function Lamp({ className }: P) {
    return (
        <svg viewBox="0 0 240 260" className={className} fill="none" aria-hidden="true">
            <defs>
                <linearGradient id="nd-metal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6b4f3b" />
                    <stop offset="1" stopColor="#3a281d" />
                </linearGradient>
                <radialGradient id="nd-bulb" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#fff4dc" />
                    <stop offset="0.45" stopColor="#ffd08a" />
                    <stop offset="1" stopColor="#f4a640" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* clamp */}
            <path d="M184 236h34v10a6 6 0 0 1-6 6h-22a6 6 0 0 1-6-6z" fill="#2c1f16" />
            <rect x="192" y="226" width="18" height="12" rx="3" fill="url(#nd-metal)" />
            {/* lower arm */}
            <path d="M201 228 L216 122" stroke="url(#nd-metal)" strokeWidth="7" strokeLinecap="round" />
            <path d="M207 226 L221 128" stroke="#2c1f16" strokeWidth="1.5" strokeLinecap="round" />
            {/* spring */}
            <path
                d="M206 196 l8 -3 -6 -5 8 -3 -6 -5 8 -3 -6 -5 8 -3"
                stroke="#8a6a50"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            {/* elbow */}
            <circle cx="216" cy="122" r="7.5" fill="#2c1f16" stroke="#6b4f3b" strokeWidth="2.5" />
            {/* upper arm */}
            <path d="M213 118 L114 58" stroke="url(#nd-metal)" strokeWidth="7" strokeLinecap="round" />
            <circle cx="112" cy="56" r="6.5" fill="#2c1f16" stroke="#6b4f3b" strokeWidth="2.5" />
            {/* shade, pointing down-left */}
            <g transform="translate(110 55) rotate(35)">
                <path d="M-14 -6 Q0 -16 14 -6 L16 4 L-16 4 Z" fill="#3a281d" />
                <path d="M-16 4 L16 4 L44 50 Q0 60 -44 50 Z" fill="url(#nd-metal)" />
                <path d="M-16 4 L16 4 L18 8 L-18 8 Z" fill="#8a6a50" opacity="0.55" />
                <ellipse cx="0" cy="51" rx="44" ry="7" fill="#2a1c13" />
                <ellipse cx="0" cy="50" rx="40" ry="5.5" fill="#f4a640" opacity="0.55" />
                <ellipse cx="0" cy="49" rx="22" ry="9" fill="url(#nd-bulb)" />
            </g>
        </svg>
    );
}

/** Small lamp-head mark used for the brand and the next-up line. */
export function LampMark({ className }: P) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
            <path d="M8 4.5 Q12 2 16 4.5 L19 13 Q12 15.5 5 13 Z" fill="currentColor" />
            <path
                d="M8.5 16.5 Q12 18 15.5 16.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.7"
            />
            <path
                d="M6 20 Q12 22.5 18 20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.4"
            />
        </svg>
    );
}

export function Arrow({ className }: P) {
    return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
            <path
                d="M4 10h11M11 5.5 15.5 10 11 14.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Check({ className }: P) {
    return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
            <path
                d="M4.5 10.5 8.2 14 15.5 6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** A mug of tea on the desk, steam curling up. Sits in the lamp's spill light. */
export function Mug({ className }: P) {
    return (
        <svg viewBox="0 0 96 120" className={className} fill="none" aria-hidden="true">
            <defs>
                <linearGradient id="ndb-mug" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#5a3a26" />
                    <stop offset="0.55" stopColor="#8a5a38" />
                    <stop offset="1" stopColor="#3a2418" />
                </linearGradient>
            </defs>
            {/* steam */}
            <path
                d="M34 40c-6-7 6-11 0-19s4-12 0-17"
                stroke="#f4e7d4"
                strokeOpacity="0.22"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M50 42c-5-6 5-10 0-17s3-10 0-14"
                stroke="#f4e7d4"
                strokeOpacity="0.14"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            {/* handle */}
            <path d="M70 62c14 0 18 8 18 15s-6 15-19 15" stroke="#4a2f1f" strokeWidth="7" strokeLinecap="round" />
            {/* body */}
            <path d="M14 52h58l-4 52a10 10 0 0 1-10 9H28a10 10 0 0 1-10-9z" fill="url(#ndb-mug)" />
            {/* rim and tea */}
            <ellipse cx="43" cy="52" rx="29" ry="6" fill="#6b4630" />
            <ellipse cx="43" cy="52.5" rx="25" ry="4.2" fill="#2a160c" />
            <ellipse cx="38" cy="51.6" rx="9" ry="1.4" fill="#f4a640" opacity="0.35" />
            {/* lamp-side highlight */}
            <path d="M62 58l-3 44" stroke="#ffd696" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
            {/* shadow on the desk */}
            <ellipse cx="46" cy="114" rx="34" ry="4" fill="#000" opacity="0.35" />
        </svg>
    );
}

/** A pendant lamp hanging over the closing line. The shade mouth sits at (60, 92). */
export function Pendant({ className }: P) {
    return (
        <svg viewBox="0 0 120 104" className={className} fill="none" aria-hidden="true">
            <defs>
                <linearGradient id="ndb-shade" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6b4f3b" />
                    <stop offset="1" stopColor="#2f2018" />
                </linearGradient>
                <radialGradient id="ndb-bulb" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#fff4dc" />
                    <stop offset="0.5" stopColor="#ffd08a" />
                    <stop offset="1" stopColor="#f4a640" stopOpacity="0" />
                </radialGradient>
            </defs>
            <path d="M60 0v40" stroke="#4a3426" strokeWidth="2" />
            <rect x="53" y="38" width="14" height="10" rx="3" fill="#3a281d" />
            <path d="M54 48h12l38 38q-44 10-88 0z" fill="url(#ndb-shade)" />
            <ellipse cx="60" cy="87" rx="44" ry="6" fill="#2a1c13" />
            <ellipse cx="60" cy="86" rx="40" ry="4.5" fill="#f4a640" opacity="0.5" />
            <ellipse cx="60" cy="86" rx="20" ry="8" fill="url(#ndb-bulb)" />
        </svg>
    );
}
