import { Calculator, Atom, FlaskConical, Dna, Moon, BookOpen } from "lucide-react";

export const subjectConfig: Record<
    string,
    {
        icon: React.ReactNode;
        color: string;
        bgColor: string;
        borderColor: string;
    }
> = {
    math: {
        icon: <Calculator className="h-8 w-8" />,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-200 dark:border-orange-900",
    },
    phys: {
        icon: <Atom className="h-8 w-8" />,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-200 dark:border-purple-900",
    },
    chem: {
        icon: <FlaskConical className="h-8 w-8" />,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-200 dark:border-blue-900",
    },
    biol: {
        icon: <Dna className="h-8 w-8" />,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-200 dark:border-green-900",
    },
    islm: {
        icon: <Moon className="h-8 w-8" />,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-200 dark:border-emerald-900",
    },
    dhiv: {
        icon: <BookOpen className="h-8 w-8" />,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-200 dark:border-rose-900",
    },
};

export const defaultSubjectConfig = {
    icon: <BookOpen className="h-8 w-8" />,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-200 dark:border-gray-800",
};
