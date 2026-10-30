import { BarChart3, BookOpen, CalendarCheck, LayoutDashboard, Settings, Shield, Timer, type LucideIcon } from "lucide-react";

export const site = {
    name: "Study-IAL",
    tagline: "Topic-by-topic practice for Edexcel International A Level.",
    description:
        "Practise IAL questions by specification topic, see exactly where you're weak, and follow a study plan built around your exam dates.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export type NavItem = { href: string; label: string; icon: LucideIcon; adminOnly?: boolean };

export const appNav: NavItem[] = [
    { href: "/dashboard", label: "Today", icon: LayoutDashboard },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/progress", label: "Progress", icon: BarChart3 },
    { href: "/plans", label: "Study plans", icon: CalendarCheck },
    { href: "/focus", label: "Focus", icon: Timer },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];
