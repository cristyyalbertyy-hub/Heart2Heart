import { NextResponse } from "next/server";
import { clearSession, getSession } from "@/lib/auth";
import { isGoodbyeMessage } from "@/lib/chat";
import { prisma } from "@/lib/prisma";
import { isVoiceContent, MAX_VOICE_BYTES } from "@/lib/voice";

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
          select: { id: true, displayName: true, avatarId: true },
        },
      },
    }),
    prisma.roomMember.findMany({
      where: { roomId: session.roomId },
      select: { id: true, displayName: true, avatarId: true },
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

    if (isVoiceContent(trimmed)) {
      const audio = trimmed.slice("voice:".length);
      if (
        !audio.startsWith("data:audio/") ||
        Buffer.byteLength(trimmed, "utf8") > MAX_VOICE_BYTES
      ) {
        return NextResponse.json(
          { error: "Voice note is too long. Try a shorter one." },
          { status: 400 }
        );
      }
    }

    if (isGoodbyeMessage(trimmed)) {
      await prisma.room.delete({
        where: { id: session.roomId },
      });
      await clearSession();

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
          select: { id: true, displayName: true, avatarId: true },
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
