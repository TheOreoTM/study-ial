"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PomodoroTimerProps {
    taskId?: string;
    onTimerStart?: () => void;
    onTimerComplete?: () => void;
    initialMinutes?: number;
}

const PRESETS = [
    { label: "Pomodoro", minutes: 25 },
    { label: "Short Break", minutes: 5 },
    { label: "Long Break", minutes: 15 },
    { label: "Deep Work", minutes: 50 },
];

const ALARM_SOUND_PATH = "/sounds/alarm.mp3"; // Placeholder path

export function PomodoroTimer({ taskId, onTimerStart, onTimerComplete, initialMinutes = 25 }: PomodoroTimerProps) {
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(100);
    const [selectedPreset, setSelectedPreset] = useState<string>("Pomodoro");

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const totalSecondsRef = useRef(initialMinutes * 60);

    useEffect(() => {
        audioRef.current = new Audio(ALARM_SOUND_PATH);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        setIsActive(false);
                        handleComplete();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    useEffect(() => {
        const currentTotalSeconds = minutes * 60 + seconds;
        const total = totalSecondsRef.current;
        const newProgress = (currentTotalSeconds / total) * 100;
        setProgress(newProgress);
    }, [minutes, seconds]);

    const toggleTimer = () => {
        if (!isActive && onTimerStart) {
            onTimerStart();
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        const preset = PRESETS.find((p) => p.label === selectedPreset) || PRESETS[0];
        setMinutes(preset.minutes);
        setSeconds(0);
        totalSecondsRef.current = preset.minutes * 60;
        setProgress(100);
    };

    const handlePresetChange = (label: string, mins: number) => {
        setIsActive(false);
        setSelectedPreset(label);
        setMinutes(mins);
        setSeconds(0);
        totalSecondsRef.current = mins * 60;
        setProgress(100);
    };

    const handleComplete = () => {
        if (!isMuted && audioRef.current) {
            audioRef.current.play().catch((e) => console.error("Error playing sound:", e));
        }
        if (onTimerComplete) {
            onTimerComplete();
        }
    };

    const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
            {/* Presets */}
            <div className="flex flex-wrap justify-center gap-2">
                {PRESETS.map((preset) => (
                    <Button
                        key={preset.label}
                        variant={selectedPreset === preset.label ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePresetChange(preset.label, preset.minutes)}
                        className="rounded-full"
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Progress Ring Background */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className={cn(
                            "text-primary transition-all duration-1000 ease-linear",
                            isActive ? "opacity-100" : "opacity-80"
                        )}
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Text */}
                <div className="absolute flex flex-col items-center">
                    <span className="text-6xl font-bold tracking-tighter tabular-nums">
                        {formatTime(minutes)}:{formatTime(seconds)}
                    </span>
                    <span className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-widest">
                        {isActive ? "Focusing" : "Paused"}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full h-12 w-12"
                >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <Button
                    size="lg"
                    onClick={toggleTimer}
                    className={cn(
                        "rounded-full h-16 w-16 shadow-lg transition-all hover:scale-105",
                        isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"
                    )}
                >
                    {isActive ? (
                        <Pause className="h-8 w-8 fill-current" />
                    ) : (
                        <Play className="h-8 w-8 fill-current ml-1" />
                    )}
                </Button>

                <Button variant="outline" size="icon" onClick={resetTimer} className="rounded-full h-12 w-12">
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
