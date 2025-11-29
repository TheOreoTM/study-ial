"use client";

import Navbar from "@/components/navbar";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Calendar, Search, Upload, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlareHover from "@/components/GlareHover";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
        },
    },
};

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pb-20 md:pt-20 md:pb-32 px-4 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[100px] opacity-30" />
                </div>

                <motion.div
                    className="container mx-auto text-center relative z-10"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className="mb-8 inline-block">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
                            <Sparkles className="h-4 w-4" />
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            AI-Powered Learning Platform
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight"
                    >
                        Master Your IAL A-Levels
                        <br />
                        with
                        <br />
                        <span className="bg-linear-to-r from-primary to-secondary/90 bg-clip-text text-transparent">
                            Intelligent Learning
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Advanced PDF parsing, intelligent question extraction, and personalized study plans for
                        Chemistry, Biology, Physics, and Mathematics.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                            asChild
                        >
                            <Link href="/study-hub">
                                Start Learning Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/5"
                            asChild
                        >
                            <Link href="/demo">View Demo</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 relative">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Powerful Features</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to excel in your IAL A-Level studies, powered by cutting-edge AI.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain className="h-8 w-8" />}
                            title="AI-Powered Parsing"
                            description="Automatically extract questions, diagrams, and metadata from past papers using advanced AI models."
                            color="bg-blue-500/10 text-blue-500"
                        />
                        <FeatureCard
                            icon={<Search className="h-8 w-8" />}
                            title="Advanced Search"
                            description="Find questions by topic, difficulty, keywords, or upload similar questions for smart matching."
                            color="bg-purple-500/10 text-purple-500"
                        />
                        <FeatureCard
                            icon={<Calendar className="h-8 w-8" />}
                            title="Flexible Planning"
                            description="Create custom study schedules with adaptive planning based on your progress and exam dates."
                            color="bg-green-500/10 text-green-500"
                        />
                        <FeatureCard
                            icon={<Upload className="h-8 w-8" />}
                            title="Content Management"
                            description="Upload private papers or access official past papers with rich content preservation."
                            color="bg-orange-500/10 text-orange-500"
                        />
                        <FeatureCard
                            icon={<BookOpen className="h-8 w-8" />}
                            title="Topic-Based Learning"
                            description="Browse questions by specific topics across all subjects with intelligent categorization."
                            color="bg-pink-500/10 text-pink-500"
                        />
                        <FeatureCard
                            icon={<Users className="h-8 w-8" />}
                            title="Progress Tracking"
                            description="Monitor your learning progress with detailed analytics and performance insights."
                            color="bg-teal-500/10 text-teal-500"
                        />
                    </div>
                </div>
            </section>

            {/* Subjects Section */}
            <section className="py-24 px-4 bg-accent/5">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Complete Coverage</h2>
                            <p className="text-xl text-muted-foreground">
                                Master all four core IAL A-Level subjects with comprehensive resources and AI
                                assistance.
                            </p>
                        </div>
                        <Button variant="outline" size="lg" className="hidden md:flex" asChild>
                            <Link href="/subjects">
                                View All Subjects <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SubjectCard
                            title="Chemistry"
                            units="Units 1-6 (AS/A2)"
                            description="Organic, Inorganic, Physical Chemistry"
                            gradient="from-blue-500/20 to-cyan-500/20"
                            textColor="text-blue-600 dark:text-blue-400"
                        />
                        <SubjectCard
                            title="Biology"
                            units="Units 1-6 (AS/A2)"
                            description="Molecular Biology, Genetics, Ecology"
                            gradient="from-green-500/20 to-emerald-500/20"
                            textColor="text-green-600 dark:text-green-400"
                        />
                        <SubjectCard
                            title="Physics"
                            units="Units 1-6 (AS/A2)"
                            description="Mechanics, Waves, Electricity"
                            gradient="from-purple-500/20 to-pink-500/20"
                            textColor="text-purple-600 dark:text-purple-400"
                        />
                        <SubjectCard
                            title="Mathematics"
                            units="P1-P4, S1, M1"
                            description="Pure Math, Statistics, Mechanics"
                            gradient="from-orange-500/20 to-red-500/20"
                            textColor="text-orange-600 dark:text-orange-400"
                        />
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Button variant="outline" size="lg" className="w-full" asChild>
                            <Link href="/subjects">
                                View All Subjects <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -z-10" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Transform Your Studies?</h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Join thousands of students already using StudyIAL to achieve their academic goals with
                        AI-powered learning.
                    </p>
                    <Button
                        size="lg"
                        className="text-lg px-10 py-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all"
                        asChild
                    >
                        <Link href="/sign-up">
                            Start Your Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <Logo />
                            <p className="text-muted-foreground mt-4">
                                AI-powered study platform for IAL A-level students. Making learning smarter, not harder.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-6 text-foreground">Platform</h3>
                            <ul className="space-y-4 text-muted-foreground">
                                <li>
                                    <Link href="/subjects" className="hover:text-primary transition-colors">
                                        Subjects
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/study-plans" className="hover:text-primary transition-colors">
                                        Study Plans
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search" className="hover:text-primary transition-colors">
                                        Search
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-6 text-foreground">Support</h3>
                            <ul className="space-y-4 text-muted-foreground">
                                <li>
                                    <Link href="/help" className="hover:text-primary transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-primary transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/feedback" className="hover:text-primary transition-colors">
                                        Feedback
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-6 text-foreground">Legal</h3>
                            <ul className="space-y-4 text-muted-foreground">
                                <li>
                                    <Link href="/privacy" className="hover:text-primary transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-primary transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} StudyIAL. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}) {
    return (
        <GlareHover
            borderRadius="24px"
            borderColor="border-boder"
            background="#121212"
            width="100%"
            height="100%"
            glareColor="#ffffff"
            glareOpacity={0.1}
        >
            <div className="p-8 h-full flex flex-col">
                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} transition-colors mb-6`}
                >
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </GlareHover>
    );
}

function SubjectCard({
    title,
    units,
    description,
    gradient,
    textColor,
}: {
    title: string;
    units: string;
    description: string;
    gradient: string;
    textColor: string;
}) {
    return (
        <Link href="/subjects" className="group block h-full">
            <div className="relative h-full rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div
                    className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative z-10">
                    <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mb-4 bg-accent/50 inline-block px-3 py-1 rounded-full">
                        {units}
                    </p>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
        </Link>
    );
}
