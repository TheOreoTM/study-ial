"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ArrowRight, ArrowLeft, Check, Calendar, BookOpen, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBJECTS = [
    { id: "math", name: "Mathematics", icon: "📐", color: "bg-orange-500/10 text-orange-500 border-orange-200" },
    { id: "physics", name: "Physics", icon: "⚡", color: "bg-purple-500/10 text-purple-500 border-purple-200" },
    { id: "chemistry", name: "Chemistry", icon: "🧪", color: "bg-blue-500/10 text-blue-500 border-blue-200" },
    { id: "biology", name: "Biology", icon: "🧬", color: "bg-green-500/10 text-green-500 border-green-200" },
];

const TOPICS = {
    math: ["Pure Math 1", "Pure Math 2", "Statistics 1", "Mechanics 1"],
    physics: ["Mechanics", "Waves", "Electricity", "Fields"],
    chemistry: ["Organic", "Inorganic", "Physical", "Analytical"],
    biology: ["Molecules", "Cells", "Genetics", "Ecology"],
};

export function CreateStudyPlanModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        subject: "",
        topics: [] as string[],
        goal: "",
        duration: 4,
        hoursPerDay: 2,
    });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const resetForm = () => {
        setStep(1);
        setFormData({
            subject: "",
            topics: [],
            goal: "",
            duration: 4,
            hoursPerDay: 2,
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Optional: reset form on close after a delay or immediately
            // setTimeout(resetForm, 300);
        }
    };

    const handleCreate = () => {
        // Here you would call your API to create the plan
        console.log("Creating plan:", formData);
        setOpen(false);
        resetForm();
    };

    const toggleTopic = (topic: string) => {
        setFormData((prev) => ({
            ...prev,
            topics: prev.topics.includes(topic) ? prev.topics.filter((t) => t !== topic) : [...prev.topics, topic],
        }));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>New Study Plan</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background border-border">
                <div className="p-6 bg-muted/30 border-b border-border">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {step === 1 && (
                                <>
                                    <BookOpen className="w-6 h-6 text-primary" /> Select Subject
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <Target className="w-6 h-6 text-primary" /> Topics & Goals
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <Calendar className="w-6 h-6 text-primary" /> Schedule
                                </>
                            )}
                            {step === 4 && (
                                <>
                                    <Check className="w-6 h-6 text-primary" /> Review Plan
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Step {step} of 4:{" "}
                            {step === 1
                                ? "Choose the subject you want to focus on."
                                : step === 2
                                ? "Define what you want to achieve."
                                : step === 3
                                ? "Set your timeline and commitment."
                                : "Review your personalized study plan."}
                        </DialogDescription>
                    </DialogHeader>
                    {/* Progress Bar */}
                    <div className="mt-6 h-2 w-full bg-accent/40 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-in-out"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="p-6 min-h-[300px]">
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-4">
                            {SUBJECTS.map((sub) => (
                                <div
                                    key={sub.id}
                                    onClick={() => setFormData({ ...formData, subject: sub.id, topics: [] })}
                                    className={cn(
                                        "cursor-pointer relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover:scale-[1.02]",
                                        formData.subject === sub.id
                                            ? `border-primary bg-primary/5 shadow-sm`
                                            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                                    )}
                                >
                                    <span className="text-4xl mb-3">{sub.icon}</span>
                                    <span className="font-bold text-lg">{sub.name}</span>
                                    {formData.subject === sub.id && (
                                        <div className="absolute top-3 right-3 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Select Topics</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {formData.subject &&
                                        TOPICS[formData.subject as keyof typeof TOPICS]?.map((topic) => (
                                            <label
                                                key={topic}
                                                htmlFor={topic}
                                                className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer select-none"
                                            >
                                                <Checkbox
                                                    id={topic}
                                                    checked={formData.topics.includes(topic)}
                                                    onCheckedChange={() => toggleTopic(topic)}
                                                />
                                                <span className="flex-1 font-medium">{topic}</span>
                                            </label>
                                        ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Primary Goal</Label>
                                <Select
                                    value={formData.goal}
                                    onValueChange={(val) => setFormData({ ...formData, goal: val })}
                                >
                                    <SelectTrigger className="w-full h-12 text-base">
                                        <SelectValue placeholder="Select your goal..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="exam_prep">Exam Preparation</SelectItem>
                                        <SelectItem value="revision">General Revision</SelectItem>
                                        <SelectItem value="concept_mastery">Concept Mastery</SelectItem>
                                        <SelectItem value="catch_up">Catching Up</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Duration
                                    </Label>
                                    <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
                                        {formData.duration} Weeks
                                    </span>
                                </div>
                                <Slider
                                    value={[formData.duration]}
                                    onValueChange={(vals) => setFormData({ ...formData, duration: vals[0] })}
                                    min={1}
                                    max={12}
                                    step={1}
                                    className="py-4"
                                />
                                <p className="text-sm text-muted-foreground">
                                    {(() => {
                                        const weeks = formData.duration;
                                        const goal = formData.goal;

                                        if (goal === "exam_prep") {
                                            if (weeks < 4)
                                                return "Intensive crash course - expect high daily workload.";
                                            if (weeks < 8) return "Balanced study pace for thorough preparation.";
                                            return "Comprehensive mastery with a comfortable pace.";
                                        }
                                        if (goal === "revision") {
                                            if (weeks < 3) return "Quick refresher for upcoming assessments.";
                                            return "Steady review of key concepts.";
                                        }
                                        if (goal === "catch_up") {
                                            if (weeks < 4) return "Fast-tracked recovery of missed content.";
                                            return "Steady pace to close all knowledge gaps.";
                                        }
                                        // Concept Mastery / Default
                                        if (weeks < 5) return "Focused deep dive into specific areas.";
                                        return "Complete subject coverage and mastery.";
                                    })()}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Daily Commitment
                                    </Label>
                                    <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
                                        {formData.hoursPerDay} Hours/Day
                                    </span>
                                </div>
                                <Slider
                                    value={[formData.hoursPerDay]}
                                    onValueChange={(vals) => setFormData({ ...formData, hoursPerDay: vals[0] })}
                                    min={0.5}
                                    max={8}
                                    step={0.5}
                                    className="py-4"
                                />
                                <p className="text-sm text-muted-foreground">
                                    {(() => {
                                        const hours = formData.hoursPerDay;
                                        if (hours <= 1) return "Light commitment - easy to maintain daily.";
                                        if (hours <= 2) return "Steady pace - manageable alongside other work.";
                                        if (hours <= 4) return "Serious effort - expect rapid progress.";
                                        return "Intensive schedule - remember to schedule breaks!";
                                    })()}
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold text-xl text-primary mb-4">Plan Summary</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Subject</p>
                                        <p className="font-semibold text-lg capitalize">
                                            {SUBJECTS.find((s) => s.id === formData.subject)?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Goal</p>
                                        <p className="font-semibold text-lg capitalize">
                                            {formData.goal.replace("_", " ")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Duration</p>
                                        <p className="font-semibold text-lg">{formData.duration} Weeks</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Daily Effort</p>
                                        <p className="font-semibold text-lg">{formData.hoursPerDay} Hours</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Selected Topics</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.topics.length > 0 ? (
                                            formData.topics.map((t) => (
                                                <span
                                                    key={t}
                                                    className="bg-background border border-border px-2 py-1 rounded-md text-sm font-medium"
                                                >
                                                    {t}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground italic">All topics included</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-600 dark:text-yellow-400 animate-pulse">
                                    <Target className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-yellow-700 dark:text-yellow-300">AI Optimization</p>
                                    <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                                        Our AI will analyze your past performance and adjust this plan dynamically as
                                        you progress.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-muted/30 border-t border-border flex items-center justify-between sm:justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack} className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                    ) : (
                        <div></div> /* Spacer */
                    )}

                    {step < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={(step === 1 && !formData.subject) || (step === 2 && !formData.goal)}
                            className="gap-2 px-8"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleCreate} className="gap-2 px-8 bg-primary hover:bg-primary/90">
                            Create Plan <Check className="w-4 h-4" />
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
