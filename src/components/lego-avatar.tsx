import { AVATAR_SKIN, getAvatar, type AvatarId } from "@/lib/avatars";

type LegoAvatarProps = {
  avatarId: string;
  name?: string;
  size?: number;
  seated?: boolean;
  className?: string;
};

function shirtName(name: string | undefined) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "";
  return trimmed.length > 9 ? `${trimmed.slice(0, 8)}…` : trimmed;
}

export function LegoAvatar({
  avatarId,
  name,
  size = 88,
  seated = true,
  className = "",
}: LegoAvatarProps) {
  const avatar = getAvatar(avatarId as AvatarId);
  const label = shirtName(name);
  const height = seated ? size * 1.05 : size * 1.2;
  const viewH = seated ? 100 : 112;
  const torsoY = 40;
  const armY = seated ? 44 : 46;
  const legY = seated ? 68 : 72;
  const legH = seated ? 18 : 28;
  const footY = seated ? 84 : 98;

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 80 ${viewH}`}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="40" cy={footY + 8} rx="22" ry="4" fill="#00000028" />

      {/* legs */}
      <rect
        x="26"
        y={legY}
        width="12"
        height={legH}
        rx="3"
        fill={avatar.bottom}
      />
      <rect
        x="42"
        y={legY}
        width="12"
        height={legH}
        rx="3"
        fill={avatar.bottom}
      />
      <rect x="24" y={footY} width="14" height="6" rx="2" fill={avatar.bottom} />
      <rect x="42" y={footY} width="14" height="6" rx="2" fill={avatar.bottom} />

      {/* arms behind torso edges */}
      <rect x="6" y={armY} width="14" height="22" rx="6" fill={avatar.top} />
      <rect x="60" y={armY} width="14" height="22" rx="6" fill={avatar.top} />
      <circle cx="13" cy={armY + 24} r="6" fill={AVATAR_SKIN} />
      <circle cx="67" cy={armY + 24} r="6" fill={AVATAR_SKIN} />

      {/* torso / blouse */}
      <rect x="18" y={torsoY} width="44" height="32" rx="8" fill={avatar.top} />

      {label && (
        <text
          x="40"
          y={torsoY + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={avatar.nameColor}
          fontSize="9"
          fontWeight="700"
          fontFamily="system-ui, Segoe UI, sans-serif"
          letterSpacing="0.2"
        >
          {label}
        </text>
      )}

      {/* head */}
      <circle cx="40" cy="22" r="16" fill={AVATAR_SKIN} />

      {/* hair band */}
      <path
        d="M24 20 C24 8, 56 8, 56 20 L56 16 C56 6, 24 6, 24 16 Z"
        fill={avatar.hair}
      />

      {/* face */}
      <circle cx="34" cy="22" r="2.2" fill="#1f2937" />
      <circle cx="46" cy="22" r="2.2" fill="#1f2937" />
      <path
        d="M35 28 Q40 32 45 28"
        stroke="#1f2937"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
