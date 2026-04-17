import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCreditReport } from "@/lib/ai/reporter";
import { evaluatePolicy } from "@/lib/scoring/policy";

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        scores: { orderBy: { computedAt: 'desc' }, take: 1 },
        files: true,
      }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // If no scores exist yet, return a Pending/Draft state
    if (!company.scores || company.scores.length === 0) {
        return NextResponse.json({
            companyName: company.name,
            score: 0,
            rating: "Pending",
            recommendation: "ANALYSIS IN PROGRESS",
            creditLimit: "₹0.0 Cr",
            tenor: "TBD",
            roi: "TBD",
            pd: "N/A",
            metrics: { financial: 0, legal: 0, behavioral: 0 },
            summary: "Analysis is currently pending. Please upload financial documents (Bank Statements/Balance Sheets) to generate a detailed credit appraisal report."
        });
    }

    const latestScore = company.scores[0];
    const balanceFile = company.files.find(f => f.fileType === "BALANCE_SHEET" && f.status === "PROCESSED");

    // Decision Logic
    const decision = evaluatePolicy(latestScore.riskScore, {
      cashFlowStress: latestScore.cashFlowStress,
      paymentDelays: latestScore.paymentDelays
    });

    // Generate AI Explainability Text
    const summary = await generateCreditReport({
      name: company.name,
      sector: company.sector,
      score: latestScore,
      ratios: (balanceFile?.metadata as any)?.ratios || {}
    });

    // Construct Structured Report Data for UI (Receipt Style)
    const reportData = {
      companyName: company.name,
      score: Math.round(latestScore.riskScore / 10), // Scaling to 100 for visual
      rating: latestScore.riskBucket === "LOW" ? "AAA" : latestScore.riskBucket === "MEDIUM" ? "BBB" : "CCC",
      recommendation: decision.status === "APPROVED" ? "RECOMMEND APPROVE" : decision.status === "REJECTED" ? "RECOMMEND REJECT" : "MANUAL REVIEW",
      creditLimit: `₹\${(company.turnover * 0.2).toFixed(1)} Cr`,
      tenor: "36-60 months",
      roi: latestScore.riskScore > 800 ? "9.5% p.a." : "12.5% p.a.",
      pd: `\${(100 - latestScore.riskScore / 10).toFixed(2)}%`,
      metrics: {
        financial: Math.min(Math.round((latestScore.riskScore / 1000) * 100 + 10), 100),
        legal: 95, 
        behavioral: latestScore.paymentDelays ? 40 : 85
      },
      summary: summary
    };

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("GET /api/companies/[id]/report error:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
