export const AVATARS = [
  {
    id: "layla",
    label: "Layla",
    skin: "#F1C27D",
    hair: "#2C1810",
    top: "#C9A227",
    accent: "#8B1E3F",
  },
  {
    id: "omar",
    label: "Omar",
    skin: "#C68642",
    hair: "#1A120B",
    top: "#1F3A5F",
    accent: "#D4AF37",
  },
  {
    id: "nora",
    label: "Nora",
    skin: "#FFDBAC",
    hair: "#6B3A2A",
    top: "#FFFFFF",
    accent: "#B76E79",
  },
  {
    id: "karim",
    label: "Karim",
    skin: "#E0AC69",
    hair: "#3B2314",
    top: "#0F766E",
    accent: "#F5D76E",
  },
  {
    id: "sara",
    label: "Sara",
    skin: "#F6D7B0",
    hair: "#111111",
    top: "#7C3AED",
    accent: "#F8E7C9",
  },
  {
    id: "yasir",
    label: "Yasir",
    skin: "#8D5524",
    hair: "#0B0B0B",
    top: "#111827",
    accent: "#C9A227",
  },
  {
    id: "maya",
    label: "Maya",
    skin: "#F2C9A0",
    hair: "#A0522D",
    top: "#BE123C",
    accent: "#FEF3C7",
  },
  {
    id: "ziad",
    label: "Ziad",
    skin: "#D1A57A",
    hair: "#4A2C0A",
    top: "#92400E",
    accent: "#FDE68A",
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function isValidAvatarId(value: string): value is AvatarId {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function getAvatar(id: string | null | undefined) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export const DEFAULT_AVATAR_ID: AvatarId = "layla";
