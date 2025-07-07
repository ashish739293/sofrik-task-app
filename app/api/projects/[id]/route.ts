// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyJwt } from "../../../lib/auth";

// ⬇️ PUT - Update project
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyJwt(token!);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, status } = await req.json();

  const project = await prisma.project.updateMany({
    where: {
      id: params.id,
      userId: decoded.id, // 🔐 Only update if user owns project
    },
    data: {
      title,
      description,
      status,
    },
  });

  return NextResponse.json(project);
}

// ⬇️ DELETE - Delete project
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyJwt(token!);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   try {
    // 1. Delete tasks for the project
    await prisma.task.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    // 2. Delete the project
    const deleted = await prisma.project.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Project deleted successfully", deleted });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
