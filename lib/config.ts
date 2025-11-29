import {
    BookOpen,
    Store,
    FolderHeart,
    Search,
    Brain,
    Target,
    Sparkles,
    Timer,
    Users,
    Library,
    BarChart3,
    Settings,
} from "lucide-react";

export const siteConfig = {
    name: "Study-IAL",
    description: "The ultimate study companion for IAL students.",
    nav: {
        study: [
            {
                href: "/subjects",
                label: "Subjects",
                icon: BookOpen,
                description: "Browse all available subjects and topics",
            },
            {
                href: "/study-plans",
                label: "Marketplace",
                icon: Store,
                description: "Discover and clone community study plans",
            },
            {
                href: "/study-plans/me",
                label: "My Plans",
                icon: FolderHeart,
                description: "Manage your personal study plans",
            },
            {
                href: "/search",
                label: "Search",
                icon: Search,
                description: "Find questions, topics, and resources",
            },
        ],
        tools: [
            {
                href: "/ai-tutor",
                label: "AI Tutor",
                icon: Brain,
                description: "Get instant help with any concept",
                disabled: true,
            },
            {
                href: "/quiz",
                label: "Quiz Generator",
                icon: Target,
                description: "Practice your weak areas",
                disabled: true,
            },
            {
                href: "/flashcards",
                label: "Flashcards",
                icon: Sparkles,
                description: "Spaced repetition learning",
                disabled: true,
            },
            {
                href: "/pomodoro",
                label: "Focus Timer",
                icon: Timer,
                description: "Pomodoro technique timer",
            },
        ],
        more: [
            {
                href: "/community",
                label: "Community",
                icon: Users,
                description: "Connect with other students",
                disabled: true,
            },
            {
                href: "/resources",
                label: "Resources",
                icon: Library,
                description: "Textbooks and learning materials",
                disabled: true,
            },
            {
                href: "/analytics",
                label: "Analytics",
                icon: BarChart3,
                description: "Track your progress and performance",
                disabled: true,
            },
            {
                href: "/settings",
                label: "Settings",
                icon: Settings,
                description: "Customize your experience",
                disabled: false,
            },
        ],
    },
};
