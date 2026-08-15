import { getAvatar, type AvatarId } from "@/lib/avatars";

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
  const legY = seated ? 68 : 72;
  const legH = seated ? 16 : 26;
  const shoeY = seated ? 82 : 96;
  const platformY = seated ? 90 : 106;

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 80 ${viewH}`}
      className={className}
      aria-hidden="true"
    >
      {/* soft ground shadow */}
      <ellipse
        cx="40"
        cy={platformY + 2}
        rx="24"
        ry="4"
        fill="#00000022"
      />

      {/* platform */}
      <rect
        x="16"
        y={platformY}
        width="48"
        height="3"
        rx="1.5"
        fill="#A67C52"
      />

      {/* legs */}
      <rect
        x="24"
        y={legY}
        width="14"
        height={legH}
        rx="4"
        fill={avatar.bottom}
      />
      <rect
        x="42"
        y={legY}
        width="14"
        height={legH}
        rx="4"
        fill={avatar.bottom}
      />

      {/* shoes */}
      <rect x="22" y={shoeY} width="16" height="6" rx="2" fill="#5C3A1E" />
      <rect x="42" y={shoeY} width="16" height="6" rx="2" fill="#5C3A1E" />

      {/* torso / blouse */}
      <rect x="14" y="42" width="52" height="30" rx="10" fill={avatar.top} />

      {label && (
        <text
          x="40"
          y="60"
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

      {/* neck */}
      <rect x="35" y="34" width="10" height="10" rx="3" fill={avatar.skin} />

      {/* head */}
      <circle cx="40" cy="22" r="16" fill={avatar.skin} />

      {/* hair */}
      {avatar.hairStyle === "long" ? (
        <>
          <path
            d="M24 22 C24 8, 56 8, 56 22 L56 18 C56 6, 24 6, 24 18 Z"
            fill={avatar.hair}
          />
          <path
            d="M22 20 C20 28, 22 42, 26 48 L30 42 C28 34, 28 24, 30 18 Z"
            fill={avatar.hair}
          />
          <path
            d="M58 20 C60 28, 58 42, 54 48 L50 42 C52 34, 52 24, 50 18 Z"
            fill={avatar.hair}
          />
        </>
      ) : (
        <path
          d="M24 20 C24 8, 56 8, 56 20 L56 14 C56 6, 24 6, 24 14 Z"
          fill={avatar.hair}
        />
      )}

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
