"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RenameStudyPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentName: string;
    onRename: (newName: string) => Promise<void>;
}

export function RenameStudyPlanDialog({ open, onOpenChange, currentName, onRename }: RenameStudyPlanDialogProps) {
    const [name, setName] = useState(currentName);
    const [isLoading, setIsLoading] = useState(false);

    // Reset name when dialog opens
    useEffect(() => {
        if (open) {
            setName(currentName);
        }
    }, [open, currentName]);

    async function handleSave() {
        if (!name.trim() || name === currentName) {
            onOpenChange(false);
            return;
        }

        setIsLoading(true);
        try {
            await onRename(name);
            onOpenChange(false);
        } catch (error) {
            // Error handling is done in the parent or we could add it here
            console.error("Failed to rename", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Study Plan</DialogTitle>
                    <DialogDescription>Enter a new name for your study plan.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="name" className="mb-2 block">
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter plan name"
                        disabled={isLoading}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
