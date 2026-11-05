import {
    BarChart3,
    BookOpen,
    CalendarCheck,
    ClipboardList,
    Layers,
    LayoutDashboard,
    NotebookPen,
    Settings,
    Shield,
    Timer,
    type LucideIcon,
} from "lucide-react";

export const site = {
    name: "Study-IAL",
    tagline: "Topic-by-topic practice for Edexcel International A Level.",
    description:
        "Practise IAL questions by specification topic, see exactly where you're weak, and follow a study plan built around your exam dates.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    adminOnly?: boolean;
    /** Other path prefixes that count as this section (e.g. /mock under Exams) */
    also?: string[];
};

export const appNav: NavItem[] = [
    { href: "/dashboard", label: "Today", icon: LayoutDashboard },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/progress", label: "Progress", icon: BarChart3 },
    { href: "/mistakes", label: "Mistakes", icon: NotebookPen },
    { href: "/flashcards", label: "Flashcards", icon: Layers },
    { href: "/plans", label: "Plans", icon: CalendarCheck },
    { href: "/exams", label: "Exams", icon: ClipboardList, also: ["/mock"] },
    { href: "/focus", label: "Focus", icon: Timer },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];
