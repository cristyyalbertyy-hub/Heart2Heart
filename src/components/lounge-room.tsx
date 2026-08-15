"use client";

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

function seatPositions(count: number) {
  if (count <= 1) return ["42%"];
  if (count === 2) return ["22%", "62%"];
  if (count === 3) return ["14%", "42%", "70%"];
  if (count === 4) return ["8%", "30%", "54%", "76%"];

  const positions: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const pct = 6 + (i * 84) / Math.max(count - 1, 1);
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
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-amber-200/60 shadow-2xl shadow-amber-900/20">
      <div className="relative aspect-[4/5] min-h-[420px] sm:aspect-[5/4] sm:min-h-[460px]">
        {/* Warm Arabian palace backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#f8e7c9_0%,#d4a373_45%,#8b4513_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,transparent_0,transparent_46%,#7c2d12_46%,#7c2d12_54%,transparent_54%),linear-gradient(#0000_70%,#5c3317_70%)]" />

        {/* Arches */}
        <div className="absolute left-[8%] top-[8%] h-[34%] w-[24%] rounded-t-full border-[6px] border-[#c9a227]/40 bg-[#fff7e8]/20" />
        <div className="absolute right-[8%] top-[8%] h-[34%] w-[24%] rounded-t-full border-[6px] border-[#c9a227]/40 bg-[#fff7e8]/20" />
        <div className="absolute left-1/2 top-[4%] h-[38%] w-[28%] -translate-x-1/2 rounded-t-full border-[7px] border-[#d4af37]/55 bg-[#fff8e7]/25" />

        {/* Lanterns */}
        <div className="absolute left-[18%] top-[18%] h-10 w-6 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 shadow-[0_0_24px_rgba(251,191,36,0.7)]" />
        <div className="absolute right-[18%] top-[18%] h-10 w-6 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 shadow-[0_0_24px_rgba(251,191,36,0.7)]" />

        {/* Persian rug */}
        <div className="absolute bottom-[8%] left-[6%] right-[6%] h-[28%] overflow-hidden rounded-[1.5rem] border-4 border-[#7f1d1d] bg-[#9f1239] shadow-inner">
          <div className="absolute inset-3 rounded-[1rem] border-2 border-[#fbbf24]/70" />
          <div className="absolute inset-[18%] rounded-full border-2 border-[#fde68a]/80" />
          <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(45deg,#fbbf24_0_8px,transparent_8px_16px),repeating-linear-gradient(-45deg,#7f1d1d_0_8px,transparent_8px_16px)]" />
        </div>

        {/* White aristocratic sofa */}
        <div className="absolute bottom-[26%] left-[5%] right-[5%] h-[28%]">
          <div className="absolute inset-x-[4%] top-0 h-[70%] rounded-[2rem] bg-gradient-to-b from-white via-[#f8fafc] to-[#e2e8f0] shadow-[0_18px_40px_rgba(0,0,0,0.25)]" />
          <div className="absolute inset-x-0 bottom-0 h-[42%] rounded-[1.6rem] bg-gradient-to-b from-white to-[#dbe3ee] shadow-lg" />
          <div className="absolute inset-x-[8%] top-[12%] h-[18%] rounded-full bg-[#f1f5f9]" />
          {/* gold trim */}
          <div className="absolute inset-x-[6%] top-[8%] h-1 rounded-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <div className="absolute left-[3%] top-[20%] h-[45%] w-3 rounded-full bg-[#d4af37]/80" />
          <div className="absolute right-[3%] top-[20%] h-[45%] w-3 rounded-full bg-[#d4af37]/80" />
          {/* cushions */}
          <div className="absolute left-[10%] top-[28%] h-10 w-14 -rotate-6 rounded-2xl bg-[#fef3c7] shadow" />
          <div className="absolute right-[10%] top-[28%] h-10 w-14 rotate-6 rounded-2xl bg-[#fecdd3] shadow" />
        </div>

        {/* Seated members */}
        {members.map((member, index) => {
          const bubble = bubbleByMember.get(member.id);
          const left = positions[index] ?? "42%";
          const isMe = member.id === currentMemberId;

          return (
            <div
              key={member.id}
              className="absolute bottom-[30%] z-10 flex w-[88px] -translate-x-1/2 flex-col items-center"
              style={{ left }}
            >
              {bubble && (
                <div className="mb-2 max-w-[140px] animate-[fadeIn_0.35s_ease]">
                  <div
                    className={`rounded-2xl px-3 py-2 text-center text-[11px] leading-snug shadow-lg ${
                      isMe
                        ? "bg-rose-500 text-white"
                        : "bg-white/95 text-stone-800"
                    }`}
                  >
                    <p className="line-clamp-3 break-words">{bubble.content}</p>
                  </div>
                  <div
                    className={`mx-auto h-0 w-0 border-x-8 border-t-8 border-x-transparent ${
                      isMe ? "border-t-rose-500" : "border-t-white/95"
                    }`}
                  />
                </div>
              )}

              <LegoAvatar avatarId={member.avatarId} size={78} seated />
              <p
                className={`mt-1 max-w-[90px] truncate rounded-full px-2 py-0.5 text-center text-[10px] font-semibold ${
                  isMe
                    ? "bg-rose-500 text-white"
                    : "bg-black/35 text-amber-50"
                }`}
              >
                {member.displayName}
              </p>
            </div>
          );
        })}

        {members.length === 0 && (
          <p className="absolute bottom-[48%] left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/30 px-4 py-2 text-sm text-amber-50">
            Waiting for guests...
          </p>
        )}
      </div>
    </div>
  );
}
