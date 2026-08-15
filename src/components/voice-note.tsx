"use client";

import { decodeVoiceMessage } from "@/lib/voice";

type VoiceNoteProps = {
  content: string;
  compact?: boolean;
};

export function VoiceNote({ content, compact = false }: VoiceNoteProps) {
  const src = decodeVoiceMessage(content);
  if (!src) return null;

  return (
    <audio
      controls
      preload="metadata"
      src={src}
      className={compact ? "h-7 max-w-[128px]" : "h-8 w-full max-w-[220px]"}
    />
  );
}
