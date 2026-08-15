export const AVATARS = [
  {
    id: "coral",
    label: "Coral",
    hair: "#E8C96A",
    top: "#E8A090",
    nameColor: "#5C3A32",
  },
  {
    id: "azul",
    label: "Azul",
    hair: "#C4A07A",
    top: "#A8C8E8",
    nameColor: "#2A4460",
  },
  {
    id: "menta",
    label: "Menta",
    hair: "#5C4030",
    top: "#B8D8C8",
    nameColor: "#2A4A3A",
  },
  {
    id: "lilas",
    label: "Lilás",
    hair: "#E8C96A",
    top: "#C8B8E0",
    nameColor: "#3A2A55",
  },
  {
    id: "laranja",
    label: "Laranja",
    hair: "#A87850",
    top: "#E8B070",
    nameColor: "#5C3A1E",
  },
  {
    id: "rosa",
    label: "Rosa",
    hair: "#5C4030",
    top: "#E8A8C0",
    nameColor: "#5C2A40",
  },
] as const;

export const AVATAR_SKIN = "#F5D5BC";
export const AVATAR_LEG = "#E8C9A8";
export const AVATAR_FOOT = "#A67C52";
export const AVATAR_STROKE = "#5C5048";

export type AvatarId = (typeof AVATARS)[number]["id"];

export function isValidAvatarId(value: string): value is AvatarId {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function getAvatar(id: string | null | undefined) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export const DEFAULT_AVATAR_ID: AvatarId = "coral";
