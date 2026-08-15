import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { DEFAULT_AVATAR_ID, isValidAvatarId } from "@/lib/avatars";
import { prisma } from "@/lib/prisma";
import { deleteInactiveRooms } from "@/lib/cleanup";
import {
  generateRoomCode,
  isValidDisplayName,
  isValidPin,
  nameKeyFromDisplayName,
  normalizeDisplayName,
} from "@/lib/rooms";

export async function POST(request: Request) {
  try {
    const { displayName, pin, avatarId } = await request.json();
    const name = normalizeDisplayName(String(displayName ?? ""));
    const pinValue = String(pin ?? "").trim();
    const chosenAvatar = isValidAvatarId(String(avatarId ?? ""))
      ? String(avatarId)
      : DEFAULT_AVATAR_ID;

    if (!isValidDisplayName(name)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 24 characters." },
        { status: 400 }
      );
    }

    if (!isValidPin(pinValue)) {
      return NextResponse.json(
        { error: "Choose a 4-digit PIN." },
        { status: 400 }
      );
    }

    const pinHash = await bcrypt.hash(pinValue, 10);
    const nameKey = nameKeyFromDisplayName(name);

    await deleteInactiveRooms();

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
                avatarId: chosenAvatar,
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
        { error: "Could not create the chat. Please try again." },
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
      member: {
        id: member.id,
        displayName: member.displayName,
        avatarId: member.avatarId,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create the chat." },
      { status: 500 }
    );
  }
}
