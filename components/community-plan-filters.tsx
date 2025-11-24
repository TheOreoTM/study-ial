"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export function CommunityPlanFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`/study-plans?${params.toString()}`);
    }, 300);

    const handleSort = (value: string) => {
        const [sortBy, sortOrder] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        router.replace(`/study-plans?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search study plans..."
                    className="pl-9 bg-card"
                    defaultValue={searchParams.get("search")?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Select
                defaultValue={`${searchParams.get("sortBy") || "createdAt"}-${searchParams.get("sortOrder") || "desc"}`}
                onValueChange={handleSort}
            >
                <SelectTrigger className="w-[180px] bg-card">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt-desc">Newest</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="subject-asc">Subject (A-Z)</SelectItem>
                    <SelectItem value="subject-desc">Subject (Z-A)</SelectItem>
                    <SelectItem value="goal-asc">Goal (A-Z)</SelectItem>
                    <SelectItem value="goal-desc">Goal (Z-A)</SelectItem>
                    <SelectItem value="totalTargetHours-asc">Shortest Duration</SelectItem>
                    <SelectItem value="totalTargetHours-desc">Longest Duration</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
