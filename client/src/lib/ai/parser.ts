import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function parseBankStatement(filePath: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fileBuffer = await fs.readFile(filePath);
  const base64File = fileBuffer.toString("base64");

  const prompt = `
    Analyze this bank statement and extract structured data.
    Provide a JSON response with the following structure:
    {
      "summary": {
        "totalInflow": number,
        "totalOutflow": number,
        "netCashFlow": number,
        "avgMonthlyBalance": number,
        "overdraftDays": number
      },
      "transactions": [
        { "date": "string", "description": "string", "debit": number, "credit": number, "balance": number }
      ]
    }
    Only return the JSON.
  `;

  // Note: For real environment, we'd use the proper multi-modal upload. 
  // For this demo/setup, we're defining the structure.
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64File, mimeType: "application/pdf" } }
  ]);

  const response = await result.response;
  return JSON.parse(response.text().replace(/```json|```/g, ""));
}

export async function parseBalanceSheet(filePath: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fileBuffer = await fs.readFile(filePath);
  const base64File = fileBuffer.toString("base64");

  const prompt = `
    Analyze this balance sheet/financial statement and extract key ratios.
    Provide a JSON response with:
    {
      "raw": {
        "totalAssets": number,
        "totalLiabilities": number,
        "equity": number,
        "revenue": number,
        "netProfit": number
      },
      "ratios": {
        "currentRatio": number,
        "debtToEbitda": number,
        "profitMargin": number
      }
    }
    Only return the JSON.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64File, mimeType: "application/pdf" } }
  ]);

  const response = await result.response;
  return JSON.parse(response.text().replace(/```json|```/g, ""));
}
