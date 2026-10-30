import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";

/** A practice CTA. Signed-out visitors are sent to sign up instead (practice needs an account). */
export function PracticeLink({
    href,
    signedIn,
    children,
    variant,
    size,
    className,
}: {
    href: string;
    signedIn: boolean;
    children: React.ReactNode;
    className?: string;
} & VariantProps<typeof buttonVariants>) {
    return (
        <Button asChild variant={variant} size={size} className={className}>
            <Link
                href={signedIn ? href : "/sign-up"}
                title={signedIn ? undefined : "Create a free account to practise"}
            >
                {children}
            </Link>
        </Button>
    );
}
