import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
import { route, type Router } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { cloudflare } from "@better-upload/server/clients";
import { nanoid } from "nanoid";
import z from "zod";

export interface ClientMetadata {
    userId?: string;
    originalName: string;
}

const generateUniqueFilename = (directory: string, filename: string) => {
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    return `${directory}/${name}-${nanoid()}.${extension}`;
};

const router: Router = {
    client: cloudflare({
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
    }),
    bucketName: process.env.R2_BUCKET_NAME as string,
    routes: {
        images: route({
            fileTypes: ["image/*"],
            multipleFiles: true,
            maxFiles: 10,
            onBeforeUpload: async () => {
                return {
                    generateObjectInfo: ({ file }) => ({
                        key: generateUniqueFilename("images", file.name),
                        metadata: {
                            originalName: file.name,
                        },
                    }),
                };
            },
            onAfterSignedUrl: async ({ files, metadata }) => {
                return {
                    metadata,
                    files,
                };
            },
        }),
        notes: route({
            fileTypes: ["application/pdf"],
            multipleFiles: true,
            maxFiles: 10,
            clientMetadataSchema: z.object({
                userId: z.string().optional(),
                originalName: z.string(),
            }),
            onBeforeUpload: async ({ req }) => {
                const session = await auth.api.getSession({ headers: req.headers });
                if (!session?.user) {
                    throw new Error("Unauthorized");
                }

                return {
                    generateObjectInfo: ({ file }) => ({
                        key: generateUniqueFilename("notes", file.name),
                    }),
                };
            },
            onAfterSignedUrl: async ({ files, clientMetadata, req }) => {
                const session = await auth.api.getSession({ headers: req.headers });
                if (!session?.user) {
                    throw new Error("Unauthorized");
                }

                return {
                    metadata: clientMetadata,
                    files,
                };
            },
        }),
    },
};

export const { POST } = toRouteHandler(router);
