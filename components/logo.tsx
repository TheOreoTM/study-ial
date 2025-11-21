import { BookOpen } from "lucide-react";

import Link from "next/link";

export default function Logo({ withText = true }: { withText?: boolean }) {
    return (
        <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-linear-to-br from-primary to-primary/50 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all">
                <BookOpen className="h-6 w-6 text-white" />
            </div>
            {withText && <span className="text-2xl font-bold text-foreground">StudyIAL</span>}
        </Link>
    );
}
