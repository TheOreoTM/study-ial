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
                <Button variant="ghost" size="icon" aria-label="Open menu" className="-ml-2">
                    <Menu className="size-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-76 flex-col gap-6 rounded-r-xl p-4 pt-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Logo href="/dashboard" className="px-2" />
                <div className="flex-1 overflow-y-auto">
                    <NavLinks isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
                </div>
                {footer}
            </SheetContent>
        </Sheet>
    );
}
