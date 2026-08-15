import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isGoodbyeMessage } from "@/lib/chat";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const [messages, members] = await Promise.all([
    prisma.message.findMany({
      where: { roomId: session.roomId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, displayName: true },
        },
      },
    }),
    prisma.roomMember.findMany({
      where: { roomId: session.roomId },
      select: { id: true, displayName: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return NextResponse.json({ messages, members });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    const trimmed = String(content ?? "").trim();

    if (!trimmed) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (isGoodbyeMessage(trimmed)) {
      await prisma.message.deleteMany({
        where: { roomId: session.roomId },
      });

      return NextResponse.json({
        goodbye: true,
        messages: [],
      });
    }

    const message = await prisma.message.create({
      data: {
        content: trimmed,
        roomId: session.roomId,
        senderId: session.memberId,
      },
      include: {
        sender: {
          select: { id: true, displayName: true },
        },
      },
    });

    return NextResponse.json({ message, goodbye: false });
  } catch {
    return NextResponse.json(
      { error: "Could not send the message." },
      { status: 500 }
    );
  }
}
