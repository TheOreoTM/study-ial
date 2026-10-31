import {
    Award,
    CalendarCheck,
    ListChecks,
    PenLine,
    Route,
    ShieldCheck,
    Star,
    Timer,
    TrendingUp,
    Trophy,
    type LucideIcon,
} from "lucide-react";
import type { MilestoneKey } from "@/lib/milestones";

export const milestoneIcon: Record<MilestoneKey, LucideIcon> = {
    "first-answer": PenLine,
    "first-strong": Star,
    "strong-5": Award,
    "strong-15": Trophy,
    turnaround: TrendingUp,
    "unit-covered": ListChecks,
    "unit-strong": ShieldCheck,
    "steady-week": CalendarCheck,
    "focus-10h": Timer,
    "plan-on-track": Route,
};
