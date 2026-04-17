import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/companies - List all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        scores: {
          orderBy: { computedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const result = companies.map(company => ({
      id: company.id,
      name: company.name,
      sector: company.sector,
      status: company.status,
      lastUpdated: company.updatedAt,
      riskScore: company.scores[0]?.riskScore || 0,
      riskBucket: company.scores[0]?.riskBucket || "Unknown",
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

// POST /api/companies - Register a new company
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sector, businessAge, turnover } = body;

    // Defensive parsing
    const parsedAge = parseInt(businessAge) || 0;
    const parsedTurnover = parseFloat(String(turnover).replace(/[^0-9.]/g, '')) || 0;

    const company = await prisma.company.create({
      data: {
        name,
        sector,
        businessAge: parsedAge,
        turnover: parsedTurnover,
      }
    });

    return NextResponse.json(company);
  } catch (error: any) {
    console.error("POST /api/companies error:", error);
    return NextResponse.json({ 
        error: "Failed to create company", 
        details: error.message 
    }, { status: 500 });
  }
}
