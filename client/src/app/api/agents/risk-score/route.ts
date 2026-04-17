import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeRiskScore, getRiskBucket, detectAnomalies } from "@/lib/scoring/engine";

export async function POST(request: Request) {
  try {
    const { company_id, event_type } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hackerwarth12.onrender.com";

    const company = await prisma.company.findUnique({
      where: { id: company_id },
      include: { files: true }
    });

    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const bankFile = company.files.find(f => f.fileType === "BANK_STATEMENT" && f.status === "PROCESSED");
    const balanceFile = company.files.find(f => f.fileType === "BALANCE_SHEET" && f.status === "PROCESSED");

    const financialData = {
      bankSummary: (bankFile?.metadata as any)?.summary,
      ratios: (balanceFile?.metadata as any)?.ratios
    };

    const score = computeRiskScore(financialData, company.sector);
    const bucket = getRiskBucket(score);

    const companyScore = await prisma.companyScore.create({
      data: {
        companyId: company_id,
        riskScore: score,
        riskBucket: bucket,
      }
    });

    // Notify Coordinator to trigger downstream
    fetch(`\${baseUrl}/api/agents/coordinator`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: "scoring_finished",
        company_id: company_id,
        payload: { score, bucket }
      })
    });

    return NextResponse.json({ 
      success: true, 
      risk_score: score, 
      risk_bucket: bucket,
      next_agents: ["anomaly_detect", "generate_report", "apply_policy"]
    });
  } catch (error) {
    console.error("[Risk-Scoring Agent] Error:", error);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
