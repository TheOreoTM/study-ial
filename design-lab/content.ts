// Shared copy for every /design-lab homepage variant, extracted from the current homepage (app/page.tsx,
// components/landing/notebook-page.tsx) in its signed-out state. Variants may restructure layout and invent
// visuals, but must render this copy as written — that is what keeps the comparison fair.
// Static only: no auth, no data fetching. Links point at real routes but variants never need them to work.

export const content = {
    brand: "Study-IAL",

    nav: {
        links: [{ label: "Subjects", href: "/subjects" }],
        signIn: { label: "Sign in", href: "/sign-in" },
        primary: { label: "Get started", href: "/sign-up" },
    },

    hero: {
        audience: "Written for Edexcel International A Level",
        headline: "Know exactly what to revise next.",
        subtext:
            "Practise IAL questions by specification topic, see exactly where you're weak, and follow a study plan built around your exam dates.",
        primaryCta: { label: "Start practising free", href: "/sign-up" },
        secondaryCta: { label: "Browse the syllabus", href: "/subjects" },
    },

    // Shown together, e.g. "175 specification topics, 114 practice questions, and it's free."
    stats: [
        { value: "175", label: "specification topics" },
        { value: "114", label: "practice questions" },
        { value: "Free", label: "to use" },
    ],

    // The product example: a unit's topics with mastery scores, the weakest one flagged as next.
    masteryExample: {
        unitCode: "WPH11",
        unitName: "Mechanics and Materials",
        examCountdown: "Exam in 74 days",
        topics: [
            { code: "1.1", name: "Motion and kinematics", score: 86, level: "strong" },
            { code: "1.3", name: "Momentum", score: 71, level: "strong" },
            { code: "1.5", name: "Density, upthrust and viscosity", score: 38, level: "weak", isNext: true },
            { code: "1.6", name: "Hooke's law, stress and strain", score: 64, level: "developing" },
        ],
        nextUp: "Next up: density, upthrust and viscosity. 10 questions.",
    },

    howItWorks: {
        heading: "How it works",
        steps: [
            {
                title: "Pick your units",
                body: "Tell us which IAL units you're sitting and when. WPH11 in January? We plan around it.",
            },
            {
                title: "Practise by topic",
                body: "Every question is tagged to a specification topic. Answer, mark against the mark scheme, move on.",
            },
            {
                title: "Fix what's weak",
                body: "Your marks build a mastery score per topic, so you always know exactly what to revise next.",
            },
        ],
    },

    features: {
        heading: "Everything revision needs, nothing it doesn't",
        items: [
            {
                title: "Topic-level practice",
                body: "Questions organised the way the specification is, not by paper. Drill one topic until it clicks.",
            },
            {
                title: "Mastery you can see",
                body: "Recent marks, weighted toward your latest attempts, show which topics are strong and which need work.",
            },
            {
                title: "Plans that adapt",
                body: "A day-by-day plan that covers every topic before your exam, adds spaced review, and reshuffles when you fall behind.",
            },
            {
                title: "Instant marking",
                body: "Multiple choice is marked instantly. For written answers, mark yourself against the scheme, or get AI feedback point by point.",
            },
            {
                title: "Focus timer",
                body: "A built-in Pomodoro timer linked to your plan, so starting is the easy part.",
            },
            {
                title: "Built for IAL",
                body: "Edexcel International A Level units and paper codes, plus local subjects for students in the Maldives.",
            },
        ],
    },

    subjects: {
        heading: "Subjects",
        items: [
            { name: "Physics", units: 6, href: "/subjects/physics" },
            { name: "Chemistry", units: 6, href: "/subjects/chemistry" },
            { name: "Biology", units: 6, href: "/subjects/biology" },
            { name: "Mathematics", units: 9, href: "/subjects/mathematics" },
            { name: "Further Mathematics", units: 5, href: "/subjects/further-mathematics" },
        ],
    },

    closing: {
        headline: "Your next exam is closer than it looks.",
        points: ["Free to use", "Set up in a minute"],
        cta: { label: "Create your free account", href: "/sign-up" },
    },

    footer: {
        copyright: "© 2026 Study-IAL",
        disclaimer: "Not affiliated with or endorsed by Pearson Edexcel.",
    },
} as const;

export type LabContent = typeof content;

export const styles = [
    {
        slug: "lofi-study-room",
        name: "Lo-fi Study Room",
        description: "Warm dusk, soft lamp glow, muted terracotta, plum and mustard; calm and cozy.",
    },
    {
        slug: "old-library",
        name: "Old Library",
        description: "Deep forest green, cream and brass; bookish serif, quiet and academic but warm.",
    },
    {
        slug: "playful-pop",
        name: "Playful Pop",
        description: "Warm bright light theme, chunky rounded type, colourful subject cards; energetic.",
    },
    {
        slug: "soft-minimal",
        name: "Soft Minimal",
        description: "Japanese-stationery calm: lots of space, warm greys and one soft accent.",
    },
    {
        slug: "night-desk",
        name: "Night Desk",
        description: "Warm dark mode, espresso browns and amber light for late-night revision.",
    },
] as const;
