import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateRoomCode,
  isValidDisplayName,
  isValidPin,
  nameKeyFromDisplayName,
  normalizeDisplayName,
} from "@/lib/rooms";

export async function POST(request: Request) {
  try {
    const { displayName, pin } = await request.json();
    const name = normalizeDisplayName(String(displayName ?? ""));
    const pinValue = String(pin ?? "").trim();

    if (!isValidDisplayName(name)) {
      return NextResponse.json(
        { error: "O nome deve ter entre 2 e 24 caracteres." },
        { status: 400 }
      );
    }

    if (!isValidPin(pinValue)) {
      return NextResponse.json(
        { error: "Escolhe um PIN de 4 dígitos." },
        { status: 400 }
      );
    }

    const pinHash = await bcrypt.hash(pinValue, 10);
    const nameKey = nameKeyFromDisplayName(name);

    let room = null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = generateRoomCode();
      try {
        room = await prisma.room.create({
          data: {
            code,
            members: {
              create: {
                displayName: name,
                nameKey,
                pinHash,
              },
            },
          },
          include: { members: true },
        });
        break;
      } catch {
        room = null;
      }
    }

    if (!room) {
      return NextResponse.json(
        { error: "Não foi possível criar a conversa. Tenta outra vez." },
        { status: 500 }
      );
    }

    const member = room.members[0];
    await createSession({
      memberId: member.id,
      roomId: room.id,
      roomCode: room.code,
      displayName: member.displayName,
    });

    return NextResponse.json({
      room: { id: room.id, code: room.code },
      member: { id: member.id, displayName: member.displayName },
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível criar a conversa." },
      { status: 500 }
    );
  }
}
