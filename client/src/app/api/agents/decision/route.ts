import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeAutonomousDecision } from "@/lib/ai/decider";

export async function POST(request: Request) {
  try {
    const { company_id } = await request.json();

    const company = await prisma.company.findUnique({
      where: { id: company_id },
      include: { 
        scores: { orderBy: { computedAt: 'desc' }, take: 1 } 
      }
    });

    if (!company || !company.scores[0]) {
        return NextResponse.json({ error: "Insufficient data for decision" }, { status: 400 });
    }

    const score = company.scores[0];
    const decision = await computeAutonomousDecision({
        companyName: company.name,
        riskScore: score.riskScore,
        riskBucket: score.riskBucket,
        anomalies: {
            cashFlowStress: score.cashFlowStress,
            paymentDelays: score.paymentDelays
        },
        sector: company.sector
    });

    // We can save this decision to a new model later, for now we return it.
    // In a full system, this would trigger the Final Report.

    return NextResponse.json({ 
        success: true, 
        agent: "DecisionAgent@Aether",
        outcome: decision 
    });
  } catch (error) {
    console.error("[Decision Agent API] Error:", error);
    return NextResponse.json({ error: "Decision failed" }, { status: 500 });
  }
}
