import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeRiskScore, detectAnomalies, getRiskBucket } from "@/lib/scoring/engine";

export async function POST(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: { files: true }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Gather processed data
    const bankFile = company.files.find(f => f.fileType === "BANK_STATEMENT" && f.status === "PROCESSED");
    const balanceFile = company.files.find(f => f.fileType === "BALANCE_SHEET" && f.status === "PROCESSED");

    const financialData = {
      bankSummary: (bankFile?.metadata as any)?.summary,
      ratios: (balanceFile?.metadata as any)?.ratios
    };

    const score = computeRiskScore(financialData, company.sector);
    const bucket = getRiskBucket(score);
    const anomalies = detectAnomalies(financialData);

    const companyScore = await prisma.companyScore.create({
      data: {
        companyId: id,
        riskScore: score,
        riskBucket: bucket,
        cashFlowStress: anomalies.cashFlowStress,
        paymentDelays: anomalies.paymentDelays,
        unusualTransactions: anomalies.unusualTransactions,
      }
    });

    return NextResponse.json(companyScore);
  } catch (error) {
    console.error("POST /api/companies/[id]/score error:", error);
    return NextResponse.json({ error: "Score computation failed" }, { status: 500 });
  }
}
