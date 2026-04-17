import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { evaluatePolicy } from "@/lib/scoring/policy";

export async function POST(request: Request) {
  try {
    const { company_id } = await request.json();

    const company = await prisma.company.findUnique({
      where: { id: company_id },
      include: { scores: { orderBy: { computedAt: 'desc' }, take: 1 } }
    });

    if (!company || !company.scores[0]) return NextResponse.json({ error: "No score record" }, { status: 404 });

    const decision = evaluatePolicy(company.scores[0].riskScore, {
      cashFlowStress: company.scores[0].cashFlowStress,
      paymentDelays: company.scores[0].paymentDelays
    });

    // Save decision to company
    // Assuming we add a decision field to company later, for now we log it as autonomous
    console.log(`[Policy Agent] Decision for \${company.name}: \${decision.status} - \${decision.reason}`);

    return NextResponse.json({
      success: true,
      decision: decision.status,
      reason: decision.reason
    });
  } catch (error) {
    console.error("[Policy Agent] Error:", error);
    return NextResponse.json({ error: "Policy evaluation failed" }, { status: 500 });
  }
}
