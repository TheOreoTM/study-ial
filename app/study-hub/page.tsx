"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
    BookOpen,
    Clock,
    FileText,
    Star,
    TrendingUp,
    Settings,
    Plus,
    ArrowRight,
    Calendar,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";
import { CreateStudyPlanModal } from "@/components/create-study-plan-modal";

export default function StudyHubPage() {
    const { user, isLoaded } = useUser();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    if (!isLoaded) {
        return <LoadingSpinner text="Loading Your Study Hub..." />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
            <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <motion.header
                    variants={item}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Welcome back, <span className="text-primary">{user?.firstName || "Student"}</span>
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
                            Ready to continue your learning journey? Here's what's happening today.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* <Link
                            href="/account"
                            className="p-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary transition-colors group"
                        >
                            <Settings className="w-6 h-6 text-neutral-500 group-hover:text-primary transition-colors" />
                        </Link> */}
                        <CreateStudyPlanModal />
                    </div>
                </motion.header>

                {/* Quick Stats */}
                <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            label: "Study Hours",
                            value: "12.5",
                            suffix: "h",
                            icon: Clock,
                            color: "text-blue-500",
                            bg: "bg-blue-500/10",
                        },
                        {
                            label: "Questions Done",
                            value: "148",
                            suffix: "",
                            icon: BookOpen,
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10",
                        },
                        {
                            label: "Current Streak",
                            value: "5",
                            suffix: " days",
                            icon: TrendingUp,
                            color: "text-orange-500",
                            bg: "bg-orange-500/10",
                        },
                        {
                            label: "Average Score",
                            value: "85",
                            suffix: "%",
                            icon: Trophy,
                            color: "text-purple-500",
                            bg: "bg-purple-500/10",
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="text-sm font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                                    This Week
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold">
                                    {stat.value}
                                    <span className="text-lg text-neutral-500 font-normal">{stat.suffix}</span>
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Study Plans */}
                    <motion.div variants={item} className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-primary" />
                                Active Study Plans
                            </h2>
                            <Link
                                href="/plans"
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid gap-4">
                            {[
                                {
                                    title: "Physics: Mechanics Mastery",
                                    progress: 65,
                                    next: "Newton's Laws Practice",
                                    due: "Tomorrow",
                                },
                                {
                                    title: "Calculus Integration",
                                    progress: 30,
                                    next: "Integration by Parts",
                                    due: "In 3 days",
                                },
                            ].map((plan, i) => (
                                <div
                                    key={i}
                                    className="group bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-all cursor-pointer"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                                {plan.title}
                                            </h3>
                                            <p className="text-neutral-500 text-sm mt-1">Next: {plan.next}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                Due {plan.due}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Progress</span>
                                            <span>{plan.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${plan.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sidebar Resources */}
                    <motion.div variants={item} className="space-y-8">
                        {/* Uploaded Past Papers */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-emerald-500" />
                                    Recent Uploads
                                </h2>
                            </div>
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                {[
                                    { name: "Physics_2023_Paper1.pdf", date: "2h ago", size: "2.4 MB" },
                                    { name: "Math_Calculus_Notes.pdf", date: "Yesterday", size: "1.1 MB" },
                                    { name: "Chemistry_Lab_Report.docx", date: "3 days ago", size: "850 KB" },
                                ].map((file, i) => (
                                    <div
                                        key={i}
                                        className="p-4 border-b last:border-0 border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer flex items-center gap-3"
                                    >
                                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                            <FileText className="w-5 h-5 text-neutral-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {file.date} • {file.size}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 text-center border-t border-neutral-100 dark:border-neutral-800">
                                    <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                        View All Uploads
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Favorited Questions */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    Starred Questions
                                </h2>
                            </div>
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
                                {[
                                    { subject: "Math", topic: "Complex Numbers", difficulty: "Hard" },
                                    { subject: "Physics", topic: "Quantum Mechanics", difficulty: "Medium" },
                                ].map((q, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                                {q.subject}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    q.difficulty === "Hard"
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                }`}
                                            >
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="font-medium text-sm">{q.topic} Question #42</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
