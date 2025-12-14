"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { SUBJECTS, getUnitsBySubject, getTopicsByUnit } from "@/lib/data/curriculum";
import { subjectConfig, defaultSubjectConfig } from "@/lib/config/subjects";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, FileText, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = use(params);
    const subject = SUBJECTS.find((s) => s.id.toLowerCase() === subjectId.toLowerCase());

    if (!subject) {
        notFound();
    }

    const config = subjectConfig[subject.id] || defaultSubjectConfig;
    const units = getUnitsBySubject(subject.id);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 pb-20">
                {/* Hero Section */}
                <div className={`relative overflow-hidden ${config.bgColor} pb-20 pt-10 px-4`}>
                    <div className="container mx-auto relative z-10">
                        <Link
                            href="/subjects"
                            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Subjects
                        </Link>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-4xl"
                        >
                            <motion.div variants={itemVariants} className="flex items-center gap-6 mb-6">
                                <div className={`p-4 rounded-2xl bg-background shadow-sm ${config.color}`}>
                                    {config.icon}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-foreground">{subject.name}</h1>
                            </motion.div>

                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                            >
                                {subject.description}
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Background decoration */}
                    <div
                        className={`absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full ${config.bgColor} opacity-50 blur-3xl`}
                    />
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 -mt-10 relative z-20">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-8">
                        {units.length > 0 ? (
                            units.map((unit) => {
                                const topics = getTopicsByUnit(unit.id);
                                return (
                                    <motion.div
                                        key={unit.id}
                                        variants={itemVariants}
                                        className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bgColor} ${config.color}`}
                                                    >
                                                        {unit.code}
                                                    </span>
                                                    <h2 className="text-2xl font-bold text-foreground">{unit.name}</h2>
                                                </div>
                                                {unit.description && (
                                                    <p className="text-muted-foreground">{unit.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <FileText className="mr-2 h-4 w-4" /> Past Papers
                                                </Button>
                                                <Button size="sm">
                                                    <BrainCircuit className="mr-2 h-4 w-4" /> Generate Plan
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {topics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                                                >
                                                    <div
                                                        className={`mt-1 h-2 w-2 rounded-full ${config.color.replace(
                                                            "text-",
                                                            "bg-"
                                                        )}`}
                                                    />
                                                    <div>
                                                        <span className="text-xs font-mono text-muted-foreground block mb-1">
                                                            {topic.code}
                                                        </span>
                                                        <span className="text-sm font-medium text-foreground">
                                                            {topic.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {topics.length === 0 && (
                                                <div className="col-span-full text-center py-8 text-muted-foreground italic">
                                                    No topics listed for this unit yet.
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div variants={itemVariants} className="text-center py-20">
                                <div className="inline-flex items-center justify-center p-6 rounded-full bg-accent mb-4">
                                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">Content Coming Soon</h3>
                                <p className="text-muted-foreground">
                                    We are currently adding units and topics for {subject.name}.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
