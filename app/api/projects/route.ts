// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { verifyJwt } from "../../lib/auth";

// ⬇️ GET all projects for authenticated user
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyJwt(token!);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.Project.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: "desc" },
    include: { tasks: true },
  });

  return NextResponse.json(projects);
}

// ⬇️ POST - create new project
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyJwt(token!);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, status } = await req.json();

  if (!title || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      status,
      userId: decoded.id,
    },
  });

  return NextResponse.json(project);
}
