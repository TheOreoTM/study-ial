"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Loader2, Brain, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface LoadingAnimationProps {
    isLoading: boolean;
    onDismiss: () => void;
}

const loadingMessages = [
    "Analyzing your learning goals...",
    "Structuring your study path...",
    "Curating the best resources...",
    "Optimizing for your schedule...",
    "Finalizing your personalized plan...",
];

export function LoadingAnimation({ isLoading, onDismiss }: LoadingAnimationProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
                >
                    <div className="absolute top-6 right-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className="gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Minimize2 className="w-4 h-4" />
                            Run in background
                        </Button>
                    </div>

                    <div className="relative flex flex-col items-center max-w-md px-6 text-center">
                        {/* Animated Icons */}
                        <div className="relative w-32 h-32 mb-8">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-full"
                            >
                                <Brain className="w-16 h-16 text-primary" />
                            </motion.div>

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                            />

                            <motion.div
                                initial={{ opacity: 0, x: -20, y: 10 }}
                                animate={{ opacity: [0, 1, 0], x: [-20, -10, -20], y: [10, 0, 10] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-0 left-0"
                            >
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20, y: -10 }}
                                animate={{ opacity: [0, 1, 0], x: [20, 10, 20], y: [-10, 0, -10] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                                className="absolute bottom-0 right-0"
                            >
                                <BookOpen className="w-6 h-6 text-blue-500" />
                            </motion.div>
                        </div>

                        {/* Text Content */}
                        <motion.h2
                            key={messageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-bold mb-2"
                        >
                            {loadingMessages[messageIndex]}
                        </motion.h2>

                        <p className="text-muted-foreground">
                            This usually takes about 30 seconds. We're crafting a plan just for you.
                        </p>

                        {/* Progress Bar */}
                        <div className="w-64 h-1.5 bg-muted rounded-full mt-8 overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                    duration: 30,
                                    ease: "linear",
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
