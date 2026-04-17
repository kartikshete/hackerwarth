import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function performLegalCheck(companyName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Conduct a mock legal and compliance audit for the company: \${companyName}.
    Provide a JSON response with:
    {
      "lititationCount": number,
      "directorRisk": "Low" | "Medium" | "High",
      "complianceRisk": "Low" | "Medium" | "High",
      "gstLateFilings": number,
      "summary": "string"
    }
    Only return the JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text().replace(/```json|```/g, ""));
}
