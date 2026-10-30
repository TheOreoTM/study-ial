import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

/** Renders question stems, mark schemes and AI feedback. Supports GFM tables and $LaTeX$. */
export function Markdown({ children, className }: { children: string; className?: string }) {
    return (
        <div className={cn("prose-study", className)}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
