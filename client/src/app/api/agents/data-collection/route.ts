import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_id, file_type, file_url, fileId } = body;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hackerwarth12.onrender.com";

    // 1. Ensure file record exists
    let fileRecord;
    if (fileId) {
      fileRecord = await prisma.companyFile.findUnique({ where: { id: fileId } });
    } else {
      fileRecord = await prisma.companyFile.create({
        data: {
          companyId: company_id,
          fileType: file_type,
          fileUrl: file_url,
          status: "UPLOADED"
        }
      });
    }

    if (!fileRecord) {
       return NextResponse.json({ error: "File record not found/created" }, { status: 400 });
    }

    // Update Company status
    await prisma.company.update({
      where: { id: company_id },
      data: { status: "Processing" }
    });

    // 2. Notify Coordinator synchronously or asynchronously
    fetch(`${baseUrl}/api/agents/coordinator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "file_uploaded",
        company_id: company_id,
        payload: { file_type, fileId: fileRecord.id }
      })
    }).catch(e => console.error("Coordinator fetch failed", e)); // non-blocking

    return NextResponse.json({
      success: true,
      next_agent: "coordinator",
      fileId: fileRecord.id,
      status: "processing"
    });
  } catch (error) {
    console.error("[Data-Collection Agent] Error:", error);
    return NextResponse.json({ error: "Data collection failed" }, { status: 500 });
  }
}
