"use client";

import Image from "next/image";
import { LegoAvatar } from "@/components/lego-avatar";
import { VoiceNote } from "@/components/voice-note";
import { getAvatar } from "@/lib/avatars";
import { getRoomScene } from "@/lib/room-scenes";
import { isVoiceContent } from "@/lib/voice";

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
  sceneId?: string;
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
  sceneId,
}: LoungeRoomProps) {
  const scene = getRoomScene(sceneId);
  const positions = seatPositions(Math.max(members.length, 1));
  const bubbleByMember = new Map(
    bubbles.map((bubble) => [bubble.memberId, bubble])
  );

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-amber-200/40 shadow-2xl shadow-stone-900/30">
      <div className="relative aspect-[4/3] min-h-[320px] w-full sm:min-h-[420px]">
        <Image
          src={scene.src}
          alt={scene.label}
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
          const look = getAvatar(member.avatarId);

          return (
            <div
              key={member.id}
              className="absolute z-10 w-[76px] -translate-x-1/2 sm:w-[92px]"
              style={{
                left,
                // Sit on the white sofa cushions in the photo
                top: "48%",
              }}
            >
              {/* Bubble is absolute so it never pushes the avatar off the sofa */}
              {bubble && (
                <div className="absolute bottom-full left-1/2 z-20 mb-1 w-max max-w-[130px] -translate-x-1/2 animate-[fadeIn_0.35s_ease] sm:max-w-[150px]">
                  <div
                    className="rounded-2xl px-2.5 py-1.5 text-center text-[10px] leading-snug shadow-lg sm:text-[11px]"
                    style={{
                      backgroundColor: look.top,
                      color: look.nameColor,
                    }}
                  >
                    {isVoiceContent(bubble.content) ? (
                      <VoiceNote content={bubble.content} compact />
                    ) : (
                      <p className="line-clamp-3 break-words">{bubble.content}</p>
                    )}
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-x-[7px] border-t-[7px] border-x-transparent"
                    style={{ borderTopColor: look.top }}
                  />
                </div>
              )}

              <div className="flex justify-center drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]">
                <LegoAvatar
                  avatarId={member.avatarId}
                  name={member.displayName}
                  size={64}
                  seated
                  className="sm:hidden"
                />
                <LegoAvatar
                  avatarId={member.avatarId}
                  name={member.displayName}
                  size={78}
                  seated
                  className="hidden sm:block"
                />
              </div>
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
