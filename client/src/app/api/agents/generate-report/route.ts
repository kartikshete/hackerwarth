import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCreditReport } from "@/lib/ai/reporter";

export async function POST(request: Request) {
  try {
    const { company_id } = await request.json();

    const company = await prisma.company.findUnique({
      where: { id: company_id },
      include: { scores: { orderBy: { computedAt: 'desc' }, take: 1 }, files: true }
    });

    if (!company || !company.scores[0]) return NextResponse.json({ error: "No score record" }, { status: 404 });

    const balanceFile = company.files.find(f => f.fileType === "BALANCE_SHEET" && f.status === "PROCESSED");

    const markdown = await generateCreditReport({
      name: company.name,
      sector: company.sector,
      score: company.scores[0],
      ratios: (balanceFile?.metadata as any)?.ratios || {}
    });

    await prisma.companyReport.create({
      data: {
        companyId: company_id,
        markdown: markdown,
      }
    });

    return NextResponse.json({ success: true, report: { markdown } });
  } catch (error) {
    console.error("[Report Agent] Error:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
