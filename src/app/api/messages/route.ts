import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isGoodbyeMessage } from "@/lib/chat";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, displayName: true, username: true },
      },
    },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    const trimmed = String(content ?? "").trim();

    if (!trimmed) {
      return NextResponse.json(
        { error: "A mensagem não pode estar vazia." },
        { status: 400 }
      );
    }

    if (isGoodbyeMessage(trimmed)) {
      await prisma.message.deleteMany();

      return NextResponse.json({
        goodbye: true,
        messages: [],
      });
    }

    const message = await prisma.message.create({
      data: {
        content: trimmed,
        senderId: session.userId,
      },
      include: {
        sender: {
          select: { id: true, displayName: true, username: true },
        },
      },
    });

    return NextResponse.json({ message, goodbye: false });
  } catch {
    return NextResponse.json(
      { error: "Erro ao enviar mensagem." },
      { status: 500 }
    );
  }
}
