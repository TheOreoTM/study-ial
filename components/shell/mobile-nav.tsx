"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { NavLinks } from "./nav-links";

export function MobileNav({ isAdmin, footer }: { isAdmin: boolean; footer?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col gap-6 p-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Logo href="/dashboard" />
                <div className="flex-1">
                    <NavLinks isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
                </div>
                {footer}
            </SheetContent>
        </Sheet>
    );
}
