import { NextResponse } from "next/server";
import { runMonitoringJob } from "@/lib/scoring/policy";

export async function POST(request: Request) {
  try {
    const { company_id } = await request.json();
    
    // In a real agentic setup, this could be triggered for all or one entity
    const alerts = await runMonitoringJob();

    return NextResponse.json({ 
      success: true, 
      alerts_created: alerts.length 
    });
  } catch (error) {
    console.error("[Monitoring Agent] Error:", error);
    return NextResponse.json({ error: "Monitoring failed" }, { status: 500 });
  }
}
