import prisma from "@/lib/prisma";

export interface PolicyDecision {
  status: "APPROVED" | "REJECTED" | "MANUAL_REVIEW";
  reason: string;
}

export function evaluatePolicy(score: number, anomalies: any): PolicyDecision {
  if (score >= 850 && !anomalies.cashFlowStress) {
    return { status: "APPROVED", reason: "Strong credit profile with no stress flags." };
  }
  
  if (score < 400 || anomalies.paymentDelays) {
    return { status: "REJECTED", reason: "Significant risk detected in payment behavior or score." };
  }

  return { status: "MANUAL_REVIEW", reason: "Profile requires deeper underwriter review." };
}

export async function runMonitoringJob() {
  const companies = await prisma.company.findMany({
    include: { scores: { orderBy: { computedAt: 'desc' }, take: 2 } }
  });

  const alertsCreated = [];

  for (const company of companies) {
    const latest = company.scores[0];
    const previous = company.scores[1];

    if (latest && previous) {
      const drop = previous.riskScore - latest.riskScore;
      if (drop >= 100) {
        const alert = await prisma.alert.create({
          data: {
            companyId: company.id,
            type: "Significant Score Drop",
            severity: "Critical",
            description: `Risk score plummeted from \${previous.riskScore} to \${latest.riskScore} (- \${drop} points).`
          }
        });
        alertsCreated.push(alert);
      }
    }
  }

  return alertsCreated;
}
