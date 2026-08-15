import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ member: null }, { status: 401 });
  }

  const room = await prisma.room.findUnique({
    where: { id: session.roomId },
    include: {
      members: {
        select: { id: true, displayName: true, avatarId: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ member: null }, { status: 401 });
  }

  const me = room.members.find((member) => member.id === session.memberId);

  return NextResponse.json({
    member: {
      id: session.memberId,
      displayName: session.displayName,
      avatarId: me?.avatarId ?? "mulher-loira",
    },
    room: {
      id: room.id,
      code: room.code,
      members: room.members,
    },
  });
}
