"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { SUBJECTS, getUnitsBySubject } from "@/lib/data/curriculum";
import { subjectConfig, defaultSubjectConfig } from "@/lib/config/subjects";

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

export default function SubjectsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 pt-15 pb-20 px-4">
                <div className="container mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
                        >
                            Explore Subjects
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive resources, past papers, and AI-powered tools for all your IAL A-Level
                            subjects.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {SUBJECTS.map((subject) => {
                            const config = subjectConfig[subject.id] || defaultSubjectConfig;
                            const units = getUnitsBySubject(subject.id).map((u) => u.code);

                            return (
                                <SubjectDetailCard
                                    key={subject.id}
                                    title={subject.name}
                                    icon={config.icon}
                                    description={subject.description || `Study resources for ${subject.name}`}
                                    units={units}
                                    color={config.color}
                                    bgColor={config.bgColor}
                                    borderColor={config.borderColor}
                                    href={`/subjects/${subject.id}`}
                                />
                            );
                        })}
                    </motion.div>
                </div>
            </main>

            <footer className="bg-card border-t border-border py-12 px-4">
                <div className="container mx-auto text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} StudyIAL. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function SubjectDetailCard({
    title,
    icon,
    description,
    units,
    color,
    bgColor,
    borderColor,
    href,
}: {
    title: string;
    icon: React.ReactNode;
    description: string;
    units: string[];
    color: string;
    bgColor: string;
    borderColor: string;
    href: string;
}) {
    const chipContainerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3,
            },
        },
    };

    const chipVariants: Variants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 15,
            },
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-3xl border ${borderColor} bg-card p-8 transition-shadow hover:shadow-lg`}
        >
            <div
                className={`absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full ${bgColor} opacity-50 blur-3xl transition-all group-hover:scale-150`}
            />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bgColor} ${color}`}>
                        {icon}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                </div>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>

                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                        Available Units
                    </h3>
                    <motion.div
                        className="flex flex-wrap gap-2"
                        variants={chipContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {units.length > 0 ? (
                            units.map((unit) => (
                                <motion.span
                                    key={unit}
                                    variants={chipVariants}
                                    className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium"
                                >
                                    {unit}
                                </motion.span>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm italic">No units available yet</span>
                        )}
                    </motion.div>
                </div>

                <div className="mt-auto pt-6">
                    <Button className="w-full sm:w-auto rounded-full" size="lg" asChild>
                        <Link href={href}>
                            Start Studying {title} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
