// Subject accent colours (Subject.color). Full class strings so Tailwind can see them.
const accents: Record<string, string> = {
    teal: "bg-teal-500/12 text-teal-700 dark:text-teal-300",
    blue: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
    violet: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    rose: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
    emerald: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    orange: "bg-orange-500/12 text-orange-700 dark:text-orange-300",
    slate: "bg-slate-500/12 text-slate-700 dark:text-slate-300",
};

export function subjectAccent(color: string) {
    return accents[color] ?? accents.slate;
}
