import { prisma } from "@/lib/prisma";

export const ROOM_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function deleteInactiveRooms(olderThanMs = ROOM_TTL_MS) {
  const cutoff = new Date(Date.now() - olderThanMs);

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      createdAt: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const staleIds = rooms
    .filter((room) => {
      const lastActivity = room.messages[0]?.createdAt ?? room.createdAt;
      return lastActivity < cutoff;
    })
    .map((room) => room.id);

  if (staleIds.length === 0) {
    return { deleted: 0 };
  }

  const result = await prisma.room.deleteMany({
    where: { id: { in: staleIds } },
  });

  return { deleted: result.count };
}

export async function deleteAllRooms() {
  const result = await prisma.room.deleteMany();
  return { deleted: result.count };
}
