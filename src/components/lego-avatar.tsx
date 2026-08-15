import { getAvatar, type AvatarId } from "@/lib/avatars";

type LegoAvatarProps = {
  avatarId: string;
  size?: number;
  seated?: boolean;
  className?: string;
};

export function LegoAvatar({
  avatarId,
  size = 88,
  seated = true,
  className = "",
}: LegoAvatarProps) {
  const avatar = getAvatar(avatarId as AvatarId);
  const height = seated ? size * 1.15 : size * 1.35;

  return (
    <svg
      width={size}
      height={height}
      viewBox={seated ? "0 0 80 92" : "0 0 80 108"}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="40" cy={seated ? 86 : 102} rx="22" ry="5" fill="#00000022" />

      {/* legs / seated lower body */}
      {seated ? (
        <>
          <rect x="18" y="62" width="18" height="18" rx="4" fill={avatar.top} />
          <rect x="44" y="62" width="18" height="18" rx="4" fill={avatar.top} />
          <rect x="20" y="76" width="14" height="8" rx="3" fill="#1f2937" />
          <rect x="46" y="76" width="14" height="8" rx="3" fill="#1f2937" />
        </>
      ) : (
        <>
          <rect x="24" y="70" width="14" height="26" rx="4" fill={avatar.top} />
          <rect x="42" y="70" width="14" height="26" rx="4" fill={avatar.top} />
          <rect x="24" y="92" width="14" height="8" rx="3" fill="#1f2937" />
          <rect x="42" y="92" width="14" height="8" rx="3" fill="#1f2937" />
        </>
      )}

      {/* torso */}
      <rect
        x="22"
        y={seated ? 42 : 48}
        width="36"
        height={seated ? 24 : 28}
        rx="6"
        fill={avatar.top}
      />
      <rect
        x="28"
        y={seated ? 48 : 54}
        width="24"
        height="6"
        rx="2"
        fill={avatar.accent}
        opacity="0.9"
      />

      {/* arms */}
      <rect
        x="10"
        y={seated ? 46 : 52}
        width="12"
        height="18"
        rx="4"
        fill={avatar.skin}
      />
      <rect
        x="58"
        y={seated ? 46 : 52}
        width="12"
        height="18"
        rx="4"
        fill={avatar.skin}
      />

      {/* neck + head */}
      <rect x="34" y="28" width="12" height="10" rx="3" fill={avatar.skin} />
      <rect x="22" y="8" width="36" height="28" rx="8" fill={avatar.skin} />

      {/* hair */}
      <path
        d="M22 18 C22 6, 58 6, 58 18 L58 14 C58 4, 22 4, 22 14 Z"
        fill={avatar.hair}
      />
      <rect x="20" y="12" width="8" height="16" rx="3" fill={avatar.hair} />
      <rect x="52" y="12" width="8" height="16" rx="3" fill={avatar.hair} />

      {/* face */}
      <circle cx="32" cy="22" r="2.4" fill="#1f2937" />
      <circle cx="48" cy="22" r="2.4" fill="#1f2937" />
      <path
        d="M34 29 Q40 33 46 29"
        stroke="#9A3412"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
