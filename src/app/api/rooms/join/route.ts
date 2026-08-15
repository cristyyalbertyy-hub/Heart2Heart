import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidDisplayName,
  isValidPin,
  isValidRoomCode,
  MAX_MEMBERS,
  nameKeyFromDisplayName,
  normalizeDisplayName,
  normalizeRoomCode,
} from "@/lib/rooms";

export async function POST(request: Request) {
  try {
    const { code, displayName, pin } = await request.json();
    const roomCode = normalizeRoomCode(String(code ?? ""));
    const name = normalizeDisplayName(String(displayName ?? ""));
    const pinValue = String(pin ?? "").trim();

    if (!isValidRoomCode(roomCode)) {
      return NextResponse.json(
        { error: "That code is not valid." },
        { status: 400 }
      );
    }

    if (!isValidDisplayName(name)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 24 characters." },
        { status: 400 }
      );
    }

    if (!isValidPin(pinValue)) {
      return NextResponse.json(
        { error: "Enter your 4-digit PIN." },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { code: roomCode },
      include: { members: true },
    });

    if (!room) {
      return NextResponse.json(
        { error: "We could not find that chat." },
        { status: 404 }
      );
    }

    const nameKey = nameKeyFromDisplayName(name);
    const existing = room.members.find((member) => member.nameKey === nameKey);

    if (existing) {
      const pinOk = await bcrypt.compare(pinValue, existing.pinHash);
      if (!pinOk) {
        return NextResponse.json(
          { error: "Incorrect PIN." },
          { status: 401 }
        );
      }

      await createSession({
        memberId: existing.id,
        roomId: room.id,
        roomCode: room.code,
        displayName: existing.displayName,
      });

      return NextResponse.json({
        room: { id: room.id, code: room.code },
        member: { id: existing.id, displayName: existing.displayName },
      });
    }

    if (room.members.length >= MAX_MEMBERS) {
      return NextResponse.json(
        { error: "This chat is already full." },
        { status: 403 }
      );
    }

    const member = await prisma.roomMember.create({
      data: {
        roomId: room.id,
        displayName: name,
        nameKey,
        pinHash: await bcrypt.hash(pinValue, 10),
      },
    });

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
      { error: "Could not join the chat." },
      { status: 500 }
    );
  }
}
