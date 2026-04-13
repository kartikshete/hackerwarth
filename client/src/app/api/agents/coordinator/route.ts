import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { event_type, company_id, payload } = await request.json();
    const host = request.headers.get("host") || "hackerwarth12.onrender.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    console.log(`[Coordinator] Received event: \${event_type} for company: \${company_id}`);

    let triggeredAgents = [];

    switch (event_type) {
      case "file_uploaded":
        const { file_type, fileId } = payload;
        if (file_type === "BANK_STATEMENT") {
          triggeredAgents.push("parsing_bank_statement");
          await fetch(`\${baseUrl}/api/agents/parse/bank-statement/\${fileId}`, { method: "POST" });
        } else if (file_type === "BALANCE_SHEET") {
          triggeredAgents.push("parsing_balance_sheet");
          await fetch(`\${baseUrl}/api/agents/parse/balance-sheet/\${fileId}`, { method: "POST" });
        }
        break;

      case "parsing_finished":
        triggeredAgents.push("risk_scoring");
        await fetch(`\${baseUrl}/api/agents/risk-score`, { 
          method: "POST", 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company_id, event_type: "data_ready" }) 
        });
        break;

      case "scoring_finished":
        triggeredAgents.push("anomaly_detection");
        triggeredAgents.push("report_generation");
        triggeredAgents.push("autonomous_decision");
        
        // Execute analytical & decision agents
        await Promise.all([
            fetch(`\${baseUrl}/api/agents/anomaly-detect`, { 
                method: "POST", 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_id }) 
            }),
            fetch(`\${baseUrl}/api/agents/generate-report`, { 
                method: "POST", 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_id }) 
            }),
            fetch(`\${baseUrl}/api/agents/decision`, { 
                method: "POST", 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_id }) 
            }),
            // Reset status
            prisma.company.update({
                where: { id: company_id },
                data: { status: "Ready" }
            })
        ]);
        break;

      case "anomaly_detected":
        if (payload?.has_critical_flags) {
            triggeredAgents.push("alerting");
            fetch(`\${baseUrl}/api/agents/monitor`, { 
              method: "POST", 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ company_id }) 
            });
        }
        break;

      default:
        console.log(`[Coordinator] No action for event: \${event_type}`);
    }

    return NextResponse.json({
      success: true,
      event_processed: event_type,
      triggered_agents: triggeredAgents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[Coordinator] Error:", error);
    return NextResponse.json({ error: "Orchestration failed" }, { status: 500 });
  }
}
                                   