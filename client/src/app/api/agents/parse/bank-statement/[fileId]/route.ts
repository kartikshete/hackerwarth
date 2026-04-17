import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseBankStatement } from "@/lib/ai/parser";

export async function POST(
  request: Request,
  { params }: any
) {
  try {
    const { fileId } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hackerwarth12.onrender.com";

    const companyFile = await prisma.companyFile.update({
      where: { id: fileId },
      data: { status: "PROCESSING" }
    });

    // 1. Core Parsing logic
    const parsedData = await parseBankStatement(companyFile.fileUrl);

    // 2. Save and Complete
    await prisma.companyFile.update({
      where: { id: fileId },
      data: { 
        status: "PROCESSED",
        metadata: parsedData as any
      }
    });

    // 3. Notify Coordinator
    fetch(`\${baseUrl}/api/agents/coordinator`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: "parsing_finished",
        company_id: companyFile.companyId,
        payload: { file_type: "BANK_STATEMENT", fileId }
      })
    });

    return NextResponse.json({ success: true, parsed: parsedData });
  } catch (error) {
    console.error("[Bank-Parsing Agent] Error:", error);
    const p = await params;
    if (p.fileId) {
        await prisma.companyFile.update({ where: { id: p.fileId }, data: { status: "FAILED" } });
    }
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
