export const AVATARS = [
  {
    id: "vermelho",
    label: "Vermelho",
    hair: "#1A120B",
    top: "#E53935",
    bottom: "#2C2C2C",
    nameColor: "#FFFFFF",
  },
  {
    id: "azul",
    label: "Azul",
    hair: "#1A120B",
    top: "#1E88E5",
    bottom: "#2C2C2C",
    nameColor: "#FFFFFF",
  },
  {
    id: "verde",
    label: "Verde",
    hair: "#1A120B",
    top: "#43A047",
    bottom: "#2C2C2C",
    nameColor: "#FFFFFF",
  },
  {
    id: "roxo",
    label: "Roxo",
    hair: "#1A120B",
    top: "#8E24AA",
    bottom: "#2C2C2C",
    nameColor: "#FFFFFF",
  },
  {
    id: "laranja",
    label: "Laranja",
    hair: "#1A120B",
    top: "#FB8C00",
    bottom: "#2C2C2C",
    nameColor: "#FFFFFF",
  },
  {
    id: "turquesa",
    label: "Turquesa",
    hair: "#1A120B",
    top: "#26A69A",
    bottom: "#2C2C2C",
    nameColor: "#FFFFFF",
  },
] as const;

export const AVATAR_SKIN = "#F5D76E";

export type AvatarId = (typeof AVATARS)[number]["id"];

export function isValidAvatarId(value: string): value is AvatarId {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function getAvatar(id: string | null | undefined) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export const DEFAULT_AVATAR_ID: AvatarId = "vermelho";
