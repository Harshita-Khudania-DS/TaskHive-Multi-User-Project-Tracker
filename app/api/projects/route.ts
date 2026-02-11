import { prisma } from "../../../prisma/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type JwtPayload = {
  userId: string;
};

/* =========================
   CREATE PROJECT
========================= */
export async function POST(req: Request) {
  try {
    const { title, description, techStack, status } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        status,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Error creating project" }, { status: 500 });
  }
}

/* =========================
   GET PROJECTS
========================= */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const projects = await prisma.project.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" }, // optional but professional
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

/* =========================
   UPDATE PROJECT
========================= */
export async function PUT(req: Request) {
  try {
    const { id, title, description, techStack, status } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const project = await prisma.project.update({
      where: { id },
      data: { title, description, techStack, status },
    });

    // Optional safety check: ensure project belongs to user
    if (project.userId !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Error updating project" }, { status: 500 });
  }
}

/* =========================
   DELETE PROJECT
========================= */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
  }
}
