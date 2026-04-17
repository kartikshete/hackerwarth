import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface DecisionInput {
  companyName: string;
  riskScore: number;
  riskBucket: string;
  anomalies: any;
  sector: string;
}

export async function computeAutonomousDecision(input: DecisionInput) {
  const prompt = `
    System: You are the Aether Autonomous Decision Agent. Your goal is to provide a credit underwriting decision.
    
    Data:
    - Entity: \${input.companyName}
    - Quantitative Score: \${input.riskScore}/1000 (\${input.riskBucket})
    - Forensic Flags: \${JSON.stringify(input.anomalies)}
    - Sector Stability: \${input.sector}

    Task:
    Provide a final credit decision in JSON format:
    {
      "decision": "APPROVE" | "REJECT" | "ESCALATE",
      "limit_recommendation": "string (e.g. 50 Cr)",
      "justification": "Detailed reasoning based on forensic signals"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Simplified parsing for demo
    const jsonStr = text.match(/\{[\s\S]*\}/) ? text.match(/\{[\s\S]*\}/)![0] : "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("[Decision Agent] Error:", error);
    return { 
        decision: "ESCALATE", 
        limit_recommendation: "0", 
        justification: "Autonomous decision engine failed. Manual review required." 
    };
  }
}
