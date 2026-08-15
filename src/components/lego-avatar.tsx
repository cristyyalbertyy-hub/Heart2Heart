import {
  AVATAR_FOOT,
  AVATAR_LEG,
  AVATAR_SKIN,
  AVATAR_STROKE,
  getAvatar,
  type AvatarId,
} from "@/lib/avatars";

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

const stitch = {
  stroke: AVATAR_STROKE,
  strokeWidth: 1.2,
  strokeDasharray: "2.2 1.8",
  fill: "none" as const,
};

export function LegoAvatar({
  avatarId,
  name,
  size = 88,
  seated = true,
  className = "",
}: LegoAvatarProps) {
  const avatar = getAvatar(avatarId as AvatarId);
  const label = shirtName(name);
  const height = seated ? size * 1.08 : size * 1.22;
  const viewH = seated ? 102 : 114;
  const bodyCy = seated ? 58 : 62;
  const legY = seated ? 74 : 80;
  const legH = seated ? 12 : 20;
  const footY = seated ? 84 : 98;

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 80 ${viewH}`}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="40" cy={footY + 8} rx="20" ry="3.5" fill="#00000020" />

      {/* stubby legs + feet */}
      <rect
        x="28"
        y={legY}
        width="9"
        height={legH}
        rx="3"
        fill={AVATAR_LEG}
        stroke={AVATAR_STROKE}
        strokeWidth="1"
        strokeDasharray="2 1.6"
      />
      <rect
        x="43"
        y={legY}
        width="9"
        height={legH}
        rx="3"
        fill={AVATAR_LEG}
        stroke={AVATAR_STROKE}
        strokeWidth="1"
        strokeDasharray="2 1.6"
      />
      <ellipse
        cx="32.5"
        cy={footY + 3}
        rx="7"
        ry="4"
        fill={AVATAR_FOOT}
        stroke={AVATAR_STROKE}
        strokeWidth="1"
        strokeDasharray="2 1.6"
      />
      <ellipse
        cx="47.5"
        cy={footY + 3}
        rx="7"
        ry="4"
        fill={AVATAR_FOOT}
        stroke={AVATAR_STROKE}
        strokeWidth="1"
        strokeDasharray="2 1.6"
      />

      {/* round body + little arms */}
      <circle
        cx="40"
        cy={bodyCy}
        r="22"
        fill={avatar.top}
        stroke={AVATAR_STROKE}
        strokeWidth="1.2"
        strokeDasharray="2.2 1.8"
      />
      <ellipse
        cx="18"
        cy={bodyCy + 2}
        rx="7"
        ry="9"
        fill={avatar.top}
        stroke={AVATAR_STROKE}
        strokeWidth="1.1"
        strokeDasharray="2 1.6"
      />
      <ellipse
        cx="62"
        cy={bodyCy + 2}
        rx="7"
        ry="9"
        fill={avatar.top}
        stroke={AVATAR_STROKE}
        strokeWidth="1.1"
        strokeDasharray="2 1.6"
      />

      {/* center stitch on blouse */}
      <line
        x1="40"
        y1={bodyCy - 16}
        x2="40"
        y2={bodyCy + 16}
        {...stitch}
        strokeWidth="1"
      />

      {label && (
        <text
          x="40"
          y={bodyCy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={avatar.nameColor}
          fontSize="8.5"
          fontWeight="700"
          fontFamily="system-ui, Segoe UI, sans-serif"
          letterSpacing="0.15"
        >
          {label}
        </text>
      )}

      {/* head */}
      <circle
        cx="40"
        cy="22"
        r="15"
        fill={AVATAR_SKIN}
        stroke={AVATAR_STROKE}
        strokeWidth="1.2"
        strokeDasharray="2.2 1.8"
      />

      {/* scalloped hair cap */}
      <path
        d="M25 20
           C25 8, 55 8, 55 20
           C52 17, 49 19, 47 21
           C45 18, 42 17, 40 20
           C38 17, 35 18, 33 21
           C31 19, 28 17, 25 20 Z"
        fill={avatar.hair}
        stroke={AVATAR_STROKE}
        strokeWidth="1.1"
        strokeDasharray="2 1.6"
      />

      {/* blush */}
      <circle cx="30" cy="26" r="3.2" fill="#F2A8A0" opacity="0.55" />
      <circle cx="50" cy="26" r="3.2" fill="#F2A8A0" opacity="0.55" />

      {/* face */}
      <circle cx="34.5" cy="22" r="1.8" fill="#3A2F28" />
      <circle cx="45.5" cy="22" r="1.8" fill="#3A2F28" />
      <path
        d="M36 27.5 Q40 30.5 44 27.5"
        stroke="#3A2F28"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
