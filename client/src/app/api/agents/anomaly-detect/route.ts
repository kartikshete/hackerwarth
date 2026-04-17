import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { detectAnomalies } from "@/lib/scoring/engine";

export async function POST(request: Request) {
  try {
    const { company_id } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hackerwarth12.onrender.com";

    const company = await prisma.company.findUnique({
      where: { id: company_id },
      include: { files: true, scores: { orderBy: { computedAt: 'desc' }, take: 1 } }
    });

    if (!company || !company.scores[0]) return NextResponse.json({ error: "No score record" }, { status: 404 });

    const bankFile = company.files.find(f => f.fileType === "BANK_STATEMENT" && f.status === "PROCESSED");
    const anomalies = detectAnomalies((bankFile?.metadata as any)?.transactions || []);

    // Update flags in latest score
    await prisma.companyScore.update({
      where: { id: company.scores[0].id },
      data: {
        cashFlowStress: anomalies.cashFlowStress,
        paymentDelays: anomalies.paymentDelays
      }
    });

    const hasCriticalFlags = anomalies.cashFlowStress || anomalies.paymentDelays;

    // Notify Coordinator
    fetch(`\${baseUrl}/api/agents/coordinator`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: "anomaly_detected",
        company_id: company_id,
        payload: { has_critical_flags: hasCriticalFlags }
      })
    });

    return NextResponse.json({ success: true, flags: anomalies });
  } catch (error) {
    console.error("[Anomaly Agent] Error:", error);
    return NextResponse.json({ error: "Anomaly detection failed" }, { status: 500 });
  }
}
