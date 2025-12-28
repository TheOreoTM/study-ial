"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, GraduationCap, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import React, { Suspense } from "react";
import { NavbarAuthDesktop, NavbarAuthMobile } from "./navbar-auth";

const ListItem = React.forwardRef<
    React.ComponentRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType; disabled?: boolean }
>(({ className, title, children, icon: Icon, disabled, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    href={disabled ? "#" : href || "#"}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        disabled && "pointer-events-none opacity-50",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {Icon && <Icon className="h-4 w-4" />}
                        {title}
                        {disabled && <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>}
                    </div>
                    {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export default function Navbar() {
    const currentPath = usePathname();
    const isAuthPath = currentPath.startsWith("/auth");
    const isZenPath = currentPath.startsWith("/pomodoro");

    if (isAuthPath || isZenPath) {
        return null;
    }

    const studyLinks = siteConfig.nav.study;
    const toolsLinks = siteConfig.nav.tools;
    const moreLinks = siteConfig.nav.more;

    const allNavLinks = [...studyLinks];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Logo />

                {/* Desktop Nav with Hover Dropdowns */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Study
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {studyLinks.map((link) => (
                                        <ListItem key={link.href} href={link.href} title={link.label} icon={link.icon}>
                                            {link.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Tools
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {toolsLinks.map((link) => (
                                        <ListItem
                                            key={link.href}
                                            href={link.href}
                                            title={link.label}
                                            icon={link.icon}
                                            disabled={link.disabled}
                                        >
                                            {link.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">More</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                    {moreLinks.map((link) => (
                                        <ListItem
                                            key={link.href}
                                            href={link.href}
                                            title={link.label}
                                            icon={link.icon}
                                            disabled={link.disabled}
                                        >
                                            {link.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center space-x-3">
                    <div className="hidden md:block">
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-72 p-3 max-h-[80vh] overflow-y-auto">
                                {/* Study Section */}
                                <div className="mb-3">
                                    <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <GraduationCap className="h-3 w-3" />
                                        Study
                                    </p>
                                    <div className="grid gap-1">
                                        {allNavLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                                    currentPath.startsWith(link.href)
                                                        ? "bg-accent text-accent-foreground"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <link.icon className="h-4 w-4" />
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-border my-3" />

                                {/* Tools Section */}
                                <div className="mb-3">
                                    <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <Sparkles className="h-3 w-3" />
                                        Tools
                                    </p>
                                    <div className="grid gap-1">
                                        {toolsLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.disabled ? "#" : link.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                                    link.disabled
                                                        ? "pointer-events-none text-muted-foreground/50"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <link.icon className="h-4 w-4" />
                                                <span>{link.label}</span>
                                                {link.disabled && (
                                                    <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                                                        Soon
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-border my-3" />

                                {/* More Section */}
                                <div className="mb-3">
                                    <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        More
                                    </p>
                                    <div className="grid gap-1">
                                        {moreLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.disabled ? "#" : link.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                                    link.disabled
                                                        ? "pointer-events-none text-muted-foreground/50"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <link.icon className="h-4 w-4" />
                                                <span>{link.label}</span>
                                                {link.disabled && (
                                                    <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                                                        Soon
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-border my-3" />

                                {/* Mobile Auth */}
                                <NavbarAuthMobile />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-3">
                        <NavbarAuthDesktop />
                    </div>
                </div>
            </div>
        </header>
    );
}
