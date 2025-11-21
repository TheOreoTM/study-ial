"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Dna, FlaskConical, Atom } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function SubjectsPage() {
    const { isLoaded } = useUser();

    if (!isLoaded) {
        return <LoadingSpinner text="Loading Subjects..." />;
    }

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
                        <SubjectDetailCard
                            title="Mathematics"
                            icon={<Calculator className="h-8 w-8" />}
                            description="Master Pure Math, Statistics, and Mechanics with our intelligent problem solver and step-by-step explanations."
                            units={["P1", "P2", "P3", "P4", "S1", "S2", "M1", "M2"]}
                            color="text-orange-500"
                            bgColor="bg-orange-500/10"
                            borderColor="border-orange-200 dark:border-orange-900"
                            href="/subjects/mathematics"
                        />
                        <SubjectDetailCard
                            title="Physics"
                            icon={<Atom className="h-8 w-8" />}
                            description="Deep dive into Mechanics, Waves, Electricity, and Fields. Visualize concepts and practice with parsed past paper questions."
                            units={["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"]}
                            color="text-purple-500"
                            bgColor="bg-purple-500/10"
                            borderColor="border-purple-200 dark:border-purple-900"
                            href="/subjects/physics"
                        />
                        <SubjectDetailCard
                            title="Chemistry"
                            icon={<FlaskConical className="h-8 w-8" />}
                            description="Understand Organic, Inorganic, and Physical Chemistry. Access detailed reaction mechanisms and equation balancers."
                            units={["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"]}
                            color="text-blue-500"
                            bgColor="bg-blue-500/10"
                            borderColor="border-blue-200 dark:border-blue-900"
                            href="/subjects/chemistry"
                        />
                        <SubjectDetailCard
                            title="Biology"
                            icon={<Dna className="h-8 w-8" />}
                            description="Explore Molecular Biology, Genetics, and Ecology. Use our diagram recognition to label and understand complex biological structures."
                            units={["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"]}
                            color="text-green-500"
                            bgColor="bg-green-500/10"
                            borderColor="border-green-200 dark:border-green-900"
                            href="/subjects/biology"
                        />
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
    return (
        <motion.div
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-3xl border ${borderColor} bg-card p-8 transition-all hover:shadow-lg`}
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
                    <div className="flex flex-wrap gap-2">
                        {units.map((unit) => (
                            <span
                                key={unit}
                                className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium"
                            >
                                {unit}
                            </span>
                        ))}
                    </div>
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
