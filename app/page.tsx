import Navbar from "@/components/navbar";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Calendar, Search, Upload, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="">
            {/* Header */}
            <Navbar />

            {/* Hero Section */}
            <section className="py-24 px-4 md:py-32">
                <div className="container mx-auto text-center">
                    <div className="mb-8 inline-block">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/30 text-primary text-sm font-medium">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            AI-Powered Learning Platform
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                        Master Your IAL A-Levels with
                        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {" "}
                            Intelligent Learning
                        </span>
                    </h1>
                    <p
                        className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Advanced PDF parsing, intelligent question extraction, and personalized study plans for
                        Chemistry, Biology, Physics, and Mathematics. Transform your study experience with AI-powered
                        insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "0.3s" }}>
                        <Button size="lg" className="text-lg px-8 py-6 btn-glow" asChild>
                            <Link href="/dashboard">Start Learning Now</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-background" asChild>
                            <Link href="/demo">View Demo</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Powerful Features for Effective Learning
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to excel in your IAL A-Level studies
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="feature-card">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors mb-4">
                                <Brain className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered PDF Parsing</h3>
                            <p className="text-sm text-muted-foreground">
                                Automatically extract questions, diagrams, and metadata from past papers using advanced
                                AI
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors mb-4">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Search</h3>
                            <p className="text-sm text-muted-foreground">
                                Find questions by topic, difficulty, keywords, or upload similar questions for matching
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors mb-4">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Flexible Study Plans</h3>
                            <p className="text-sm text-muted-foreground">
                                Create custom study schedules with adaptive planning based on your progress and goals
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors mb-4">
                                <Upload className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Content Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Upload private papers or access official past papers with rich content preservation
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors mb-4">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Topic-Based Learning</h3>
                            <p className="text-sm text-muted-foreground">
                                Browse questions by specific topics across all subjects with intelligent categorization
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors mb-4">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Progress Tracking</h3>
                            <p className="text-sm text-muted-foreground">
                                Monitor your learning progress with detailed analytics and performance insights
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subjects Section */}
            <section className="py-20 px-4 bg-linear-to-b from-transparent to-blue-50/20">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Complete Coverage of IAL A-Level Subjects
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Master all four core subjects with comprehensive resources
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all">
                            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <h3 className="text-xl font-semibold text-primary mb-2">Chemistry</h3>
                            <p className="text-sm text-muted-foreground mb-3">Units 1-6 (AS/A2)</p>
                            <p className="text-sm text-muted-foreground">
                                Organic, Inorganic, Physical Chemistry with detailed question analysis
                            </p>
                        </div>

                        <div className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all">
                            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <h3 className="text-xl font-semibold text-accent-foreground mb-2">Biology</h3>
                            <p className="text-sm text-muted-foreground mb-3">Units 1-6 (AS/A2)</p>
                            <p className="text-sm text-muted-foreground">
                                Molecular Biology, Genetics, Ecology with diagram recognition
                            </p>
                        </div>

                        <div className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all">
                            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <h3 className="text-xl font-semibold text-primary mb-2">Physics</h3>
                            <p className="text-sm text-muted-foreground mb-3">Units 1-6 (AS/A2)</p>
                            <p className="text-sm text-muted-foreground">
                                Mechanics, Waves, Electricity with equation parsing
                            </p>
                        </div>

                        <div className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all">
                            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                            <h3 className="text-xl font-semibold text-accent-foreground mb-2">Mathematics</h3>
                            <p className="text-sm text-muted-foreground mb-3">P1-P4, S1, M1</p>
                            <p className="text-sm text-muted-foreground">
                                Pure Math, Statistics, Mechanics with formula recognition
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your A-Level Studies?</h2>
                    <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto">
                        Join thousands of students already using StudyIAL to achieve their academic goals
                    </p>
                    <Button size="lg" variant="default" className="text-lg px-8 py-6 btn-glow" asChild>
                        <Link href="/auth/register">Start Your Free Trial</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <Logo />
                            <p className="text-gray-400">AI-powered study platform for IAL A-level students</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">Platform</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/subjects" className="hover:text-white transition-colors">
                                        Subjects
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/study-plans" className="hover:text-white transition-colors">
                                        Study Plans
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search" className="hover:text-white transition-colors">
                                        Search
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/help" className="hover:text-white transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-white transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/feedback" className="hover:text-white transition-colors">
                                        Feedback
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">Legal</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/privacy" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 StudyIAL. All rights reserved. Built with ❤️ for students.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
