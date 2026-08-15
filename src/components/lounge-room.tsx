"use client";

import Image from "next/image";
import { LegoAvatar } from "@/components/lego-avatar";

export type RoomSeatMember = {
  id: string;
  displayName: string;
  avatarId: string;
};

export type RoomBubble = {
  memberId: string;
  content: string;
  createdAt: string;
};

type LoungeRoomProps = {
  members: RoomSeatMember[];
  bubbles: RoomBubble[];
  currentMemberId?: string;
};

/** Horizontal seats along the white sofa in the photo (roughly 30%–70%). */
function seatPositions(count: number) {
  if (count <= 1) return ["50%"];
  if (count === 2) return ["38%", "62%"];
  if (count === 3) return ["34%", "50%", "66%"];
  if (count === 4) return ["32%", "44%", "56%", "68%"];

  const start = 32;
  const end = 68;
  const positions: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const pct = start + ((end - start) * i) / Math.max(count - 1, 1);
    positions.push(`${pct}%`);
  }
  return positions;
}

export function LoungeRoom({
  members,
  bubbles,
  currentMemberId,
}: LoungeRoomProps) {
  const positions = seatPositions(Math.max(members.length, 1));
  const bubbleByMember = new Map(
    bubbles.map((bubble) => [bubble.memberId, bubble])
  );

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-amber-200/40 shadow-2xl shadow-stone-900/30">
      <div className="relative aspect-[4/3] min-h-[320px] w-full sm:min-h-[420px]">
        <Image
          src="/lounge-room.png"
          alt="Arabian lounge"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 672px"
        />

        {/* Soft vignette so names/bubbles stay readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        {/* Seated members on the back sofa */}
        {members.map((member, index) => {
          const bubble = bubbleByMember.get(member.id);
          const left = positions[index] ?? "50%";
          const isMe = member.id === currentMemberId;

          return (
            <div
              key={member.id}
              className="absolute z-10 flex w-[76px] -translate-x-1/2 flex-col items-center sm:w-[92px]"
              style={{
                left,
                // Sit on the white sofa cushions in the photo
                top: "48%",
              }}
            >
              {bubble && (
                <div className="mb-1 max-w-[130px] animate-[fadeIn_0.35s_ease] sm:max-w-[150px]">
                  <div
                    className={`rounded-2xl px-2.5 py-1.5 text-center text-[10px] leading-snug shadow-lg sm:text-[11px] ${
                      isMe
                        ? "bg-rose-500 text-white"
                        : "bg-white/95 text-stone-800"
                    }`}
                  >
                    <p className="line-clamp-3 break-words">{bubble.content}</p>
                  </div>
                  <div
                    className={`mx-auto h-0 w-0 border-x-[7px] border-t-[7px] border-x-transparent ${
                      isMe ? "border-t-rose-500" : "border-t-white/95"
                    }`}
                  />
                </div>
              )}

              <div className="drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]">
                <LegoAvatar
                  avatarId={member.avatarId}
                  size={64}
                  seated
                  className="sm:hidden"
                />
                <LegoAvatar
                  avatarId={member.avatarId}
                  size={78}
                  seated
                  className="hidden sm:block"
                />
              </div>
              <p
                className={`mt-0.5 max-w-[86px] truncate rounded-full px-2 py-0.5 text-center text-[9px] font-semibold shadow sm:text-[10px] ${
                  isMe
                    ? "bg-rose-500 text-white"
                    : "bg-black/45 text-amber-50"
                }`}
              >
                {member.displayName}
              </p>
            </div>
          );
        })}

        {members.length === 0 && (
          <p className="absolute left-1/2 top-[48%] z-10 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-sm text-amber-50 backdrop-blur-sm">
            Waiting for guests...
          </p>
        )}
      </div>
    </div>
  );
}
