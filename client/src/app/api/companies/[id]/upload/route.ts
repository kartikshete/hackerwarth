import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(
  request: Request,
  { params }: any
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;

    if (!file || !fileType) {
      return NextResponse.json({ error: "File and fileType are required" }, { status: 400 });
    }

    // Verify company exists
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "uploads", id);
    await fs.mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadDir, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Record in database
    const companyFile = await prisma.companyFile.create({
      data: {
        companyId: id,
        fileType: fileType as any,
        fileUrl: filePath,
        status: "UPLOADED",
      }
    });

    return NextResponse.json({ 
      success: true, 
      fileId: companyFile.id, 
      status: "UPLOADED" 
    });
  } catch (error) {
    console.error("POST /api/companies/[id]/upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
