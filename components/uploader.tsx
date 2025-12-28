"use client";

import { useUploadFiles } from "@better-upload/client";
import { UploadDropzone } from "./upload-dropzone";
import type { ClientMetadata } from "@/app/api/upload/route";

export interface UploadedFile {
    key: string;
    name: string;
    size: number;
    type: string;
}

interface UploaderProps {
    route?: "images" | "notes";
    accept?: string;
    metadata?: ClientMetadata;
    description?:
        | string
        | {
              fileTypes?: string;
              maxFileSize?: string;
              maxFiles?: number;
          };
    onUploadComplete?: (files: UploadedFile[]) => void;
    onUploadStart?: () => void;
    onUploadError?: (error: string) => void;
}

export function Uploader({
    route = "images",
    accept = "image/*",
    metadata,
    description = {
        maxFiles: 4,
        maxFileSize: "5MB",
        fileTypes: "JPEG, PNG, GIF",
    },
    onUploadComplete,
    onUploadStart,
    onUploadError,
}: UploaderProps) {
    const { control } = useUploadFiles({
        route,

        onUploadBegin: () => {
            onUploadStart?.();
        },
        onUploadComplete: ({ files }) => {
            onUploadComplete?.(
                files.map((f) => ({
                    key: f.objectInfo.key,
                    name: f.name,
                    size: f.size,
                    type: f.type,
                }))
            );
        },
        onError: ({ message }) => {
            onUploadError?.(message);
        },
    });

    return (
        <div className="space-y-4">
            <UploadDropzone
                control={control}
                accept={accept}
                metadata={metadata as unknown as Record<string, unknown>}
                description={description}
            />
        </div>
    );
}
