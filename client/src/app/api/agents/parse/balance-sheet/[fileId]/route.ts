import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseBalanceSheet } from "@/lib/ai/parser";

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

    const parsedData = await parseBalanceSheet(companyFile.fileUrl);

    await prisma.companyFile.update({
      where: { id: fileId },
      data: { 
        status: "PROCESSED",
        metadata: parsedData as any
      }
    });

    // Notify Coordinator
    fetch(`\${baseUrl}/api/agents/coordinator`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: "parsing_finished",
        company_id: companyFile.companyId,
        payload: { file_type: "BALANCE_SHEET", fileId }
      })
    });

    return NextResponse.json({ success: true, ratios: parsedData });
  } catch (error) {
    console.error("[Balance-Parsing Agent] Error:", error);
    const p = await params;
    if (p.fileId) {
        await prisma.companyFile.update({ where: { id: p.fileId }, data: { status: "FAILED" } });
    }
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
