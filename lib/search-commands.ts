// App pages and actions the search can jump to ("mock", "settings", "practise weak topics"). Pure (unit-tested): the
// palette adds these to the curriculum index, filtered for who's signed in.

import type { SearchDoc } from "@/lib/search";

type Command = {
    id: string;
    name: string;
    href: string;
    context: string;
    keywords: string[];
    /** Who sees it: signed-in students, admins only, or signed-out visitors */
    audience: "user" | "admin" | "guest" | "all";
};

const COMMANDS: Command[] = [
    { id: "today", name: "Today", href: "/dashboard", context: "Dashboard", keywords: ["home", "dashboard", "plan"], audience: "user" },
    { id: "subjects", name: "Subjects", href: "/subjects", context: "Browse the curriculum", keywords: ["units", "topics", "curriculum", "syllabus", "specification"], audience: "all" },
    { id: "weak", name: "Practise weak topics", href: "/practice?mode=weak", context: "Start a practice session", keywords: ["practice", "weakest", "revise", "questions", "start"], audience: "user" },
    { id: "mistakes", name: "Mistakes", href: "/mistakes", context: "Your mistake notebook", keywords: ["wrong", "notebook", "errors", "missed"], audience: "user" },
    { id: "redo", name: "Redo my mistakes", href: "/practice?mode=mistakes", context: "Start a practice session", keywords: ["practice", "wrong", "retry", "again"], audience: "user" },
    { id: "mock", name: "Mock papers", href: "/mock", context: "Timed papers with an indicative grade", keywords: ["exam", "paper", "timed", "test", "grade", "past paper"], audience: "user" },
    { id: "exams", name: "Exams", href: "/exams", context: "Countdown to each paper", keywords: ["countdown", "dates", "readiness", "timetable"], audience: "user" },
    { id: "progress", name: "Progress", href: "/progress", context: "Mastery, study calendar and milestones", keywords: ["mastery", "stats", "analytics", "heatmap", "calendar", "milestones", "streak"], audience: "user" },
    { id: "flashcards", name: "Flashcards", href: "/flashcards", context: "Topic decks", keywords: ["cards", "decks", "memorise", "spaced repetition"], audience: "user" },
    { id: "review", name: "Review flashcards", href: "/flashcards/review", context: "Cards due today", keywords: ["cards", "due", "spaced repetition", "memorise"], audience: "user" },
    { id: "plans", name: "Study plans", href: "/plans", context: "Your day-by-day plans", keywords: ["schedule", "timetable", "plan"], audience: "user" },
    { id: "new-plan", name: "New study plan", href: "/plans/new", context: "Plan your revision", keywords: ["create", "schedule", "timetable"], audience: "user" },
    { id: "community", name: "Community plans", href: "/plans/community", context: "Plans other students shared", keywords: ["shared", "templates"], audience: "user" },
    { id: "focus", name: "Focus timer", href: "/focus", context: "Pomodoro", keywords: ["pomodoro", "timer", "concentrate", "study session"], audience: "user" },
    { id: "settings", name: "Settings", href: "/settings", context: "Profile, units and account", keywords: ["profile", "account", "units", "exam dates", "password"], audience: "user" },
    { id: "share", name: "Share your progress", href: "/settings#share", context: "Settings", keywords: ["parent", "teacher", "link", "read only"], audience: "user" },
    { id: "admin", name: "Question bank", href: "/admin", context: "Admin", keywords: ["admin", "questions", "drafts", "publish", "import"], audience: "admin" },
    { id: "admin-cards", name: "Flashcard review", href: "/admin/flashcards", context: "Admin", keywords: ["admin", "flashcards", "drafts", "publish"], audience: "admin" },
    { id: "sign-in", name: "Sign in", href: "/sign-in", context: "Account", keywords: ["log in", "login"], audience: "guest" },
    { id: "sign-up", name: "Create a free account", href: "/sign-up", context: "Account", keywords: ["register", "sign up", "join"], audience: "guest" },
];

/** The pages and actions a visitor can jump to, as search documents. */
export function commandDocs({ signedIn, isAdmin }: { signedIn: boolean; isAdmin: boolean }): SearchDoc[] {
    return COMMANDS.filter(
        (c) =>
            c.audience === "all" ||
            (c.audience === "guest" && !signedIn) ||
            (c.audience === "user" && signedIn) ||
            (c.audience === "admin" && signedIn && isAdmin),
    ).map((c) => ({
        kind: "page",
        id: `page:${c.id}`,
        href: c.href,
        name: c.name,
        code: "",
        context: c.context,
        keywords: c.keywords,
    }));
}
