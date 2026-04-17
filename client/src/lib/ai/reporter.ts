import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateCreditReport(companyData: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate a professional 1-page Credit Appraisal Report based on the following data:
    
    Company: \${companyData.name}
    Sector: \${companyData.sector}
    Risk Score: \${companyData.score.riskScore}/1000
    Risk Bucket: \${companyData.score.riskBucket}
    
    Financial Flags:
    - Cash Flow Stress: \${companyData.score.cashFlowStress ? "YES" : "NO"}
    - Payment Delays: \${companyData.score.paymentDelays ? "YES" : "NO"}
    - Unusual Transactions: \${companyData.score.unusualTransactions ? "YES" : "NO"}
    
    Parsed Ratios: \${JSON.stringify(companyData.ratios)}
    
    The report should have:
    1. Executive Summary
    2. Financial Health Analysis
    3. Cash-flow & Behavioral Assessment
    4. Key Risks identified
    5. Final Recommendation (Approve/Reject/Monitor)
    
    Format the response as pure Markdown.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
