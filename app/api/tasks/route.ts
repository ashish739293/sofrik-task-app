// app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  
  const userId = verifyJwt(token!);
  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!userId || !projectId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { projectId },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  
  const userId = verifyJwt(token!);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.dueDate) {
   body.dueDate = new Date(body.dueDate).toISOString();
  }
  const created = await prisma.task.create({ data: body });
  return NextResponse.json(created);
}
