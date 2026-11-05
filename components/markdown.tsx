import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { hasThaana } from "@/lib/dhivehi";
import { remarkUnderline } from "@/lib/remark-underline";
import { cn } from "@/lib/utils";

/** Renders question stems, mark schemes and AI feedback. Supports GFM tables, $LaTeX$, <u> and Dhivehi. */
export function Markdown({ children, className }: { children: string; className?: string }) {
    const dhivehi = hasThaana(children);
    return (
        <div
            dir={dhivehi ? "rtl" : undefined}
            lang={dhivehi ? "dv" : undefined}
            className={cn("prose-study", dhivehi && "prose-dhivehi", className)}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkUnderline]} rehypePlugins={[rehypeKatex]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
