"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Monitor, Moon, Settings, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

export function UserMenu({
    name,
    email,
    image,
    compact = false,
}: {
    name: string;
    email: string;
    image?: string | null;
    /** Avatar-only trigger for the desktop app bar. */
    compact?: boolean;
}) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const initials = name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <DropdownMenu>
            {compact ? (
                <DropdownMenuTrigger
                    aria-label={`Account menu for ${name}`}
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    <Avatar className="size-9">
                        {image && <AvatarImage src={image} alt="" />}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
            ) : (
                <DropdownMenuTrigger className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg bg-muted p-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <Avatar className="size-9">
                        {image && <AvatarImage src={image} alt="" />}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">{name}</div>
                        <div className="truncate text-xs text-muted-foreground">{email}</div>
                    </div>
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent align="end" className="w-60">
                {compact && (
                    <>
                        <DropdownMenuLabel className="min-w-0 py-2">
                            <div className="truncate text-sm font-bold">{name}</div>
                            <div className="truncate text-xs font-medium text-muted-foreground">{email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                        <Sun className="size-4" /> Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        <Moon className="size-4" /> Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                        <Monitor className="size-4" /> System
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="size-4" /> Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        await signOut();
                        router.push("/");
                        router.refresh();
                    }}
                >
                    <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
