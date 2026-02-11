import { prisma } from "../../../../prisma/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string
  );

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("token", token);

  return response;
}
