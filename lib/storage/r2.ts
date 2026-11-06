// Cloudflare R2 storage through its S3-compatible API. The bucket must be private (no public access, no custom
// public domain); downloads use presigned GET URLs that expire within minutes.
import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { assertValidKey, type SignedUrlOptions, type StorageAdapter } from "@/lib/storage/types";

export type R2Config = { accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string };

export class R2Storage implements StorageAdapter {
    readonly kind = "r2" as const;
    private readonly client: S3Client;

    constructor(private readonly config: R2Config) {
        this.client = new S3Client({
            region: "auto",
            endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
        });
    }

    async put(key: string, body: Uint8Array, contentType: string) {
        assertValidKey(key);
        await this.client.send(
            new PutObjectCommand({ Bucket: this.config.bucket, Key: key, Body: body, ContentType: contentType }),
        );
    }

    async get(key: string) {
        assertValidKey(key);
        try {
            const res = await this.client.send(new GetObjectCommand({ Bucket: this.config.bucket, Key: key }));
            return res.Body ? new Uint8Array(await res.Body.transformToByteArray()) : null;
        } catch (err) {
            if (isNotFound(err)) return null;
            throw err;
        }
    }

    async exists(key: string) {
        assertValidKey(key);
        try {
            await this.client.send(new HeadObjectCommand({ Bucket: this.config.bucket, Key: key }));
            return true;
        } catch (err) {
            if (isNotFound(err)) return false;
            throw err;
        }
    }

    async delete(key: string) {
        assertValidKey(key);
        await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }));
    }

    async signedUrl(key: string, { expiresIn, contentType, filename }: SignedUrlOptions) {
        assertValidKey(key);
        const safeName = filename?.replace(/[^A-Za-z0-9._-]/g, "_");
        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
                ResponseContentType: contentType,
                ResponseContentDisposition: safeName ? `inline; filename="${safeName}"` : "inline",
                ResponseCacheControl: "private, no-store",
            }),
            { expiresIn: Math.min(Math.max(expiresIn, 30), 900) },
        );
    }
}

function isNotFound(err: unknown) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    return e?.name === "NoSuchKey" || e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404;
}
