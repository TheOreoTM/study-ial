import { NextResponse } from "next/server";
import { ingestPdf } from "@/lib/ai/ingestion";
import { stackServerApp } from "@/stack/server";

export async function POST(req: Request) {
    try {
        const user = await stackServerApp.getUser();
        const userId = user?.id;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return new NextResponse("Only PDF files are allowed", { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const resource = await ingestPdf(buffer, file.name, userId);

        return NextResponse.json({ resourceId: resource.id });
    } catch (error) {
        console.error("Error uploading file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
