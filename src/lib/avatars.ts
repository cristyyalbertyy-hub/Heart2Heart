export const AVATARS = [
  {
    id: "mulher-loira",
    label: "Mulher loira",
    hairStyle: "long" as const,
    skin: "#F3C7A8",
    hair: "#E8C84A",
    top: "#F5B8C8",
    bottom: "#D97890",
    nameColor: "#5C2A3A",
  },
  {
    id: "mulher-morena",
    label: "Mulher morena",
    hairStyle: "long" as const,
    skin: "#C68642",
    hair: "#5C3A1E",
    top: "#5DBDB5",
    bottom: "#2F8F88",
    nameColor: "#0F3D3A",
  },
  {
    id: "mulher-preto",
    label: "Mulher cabelo preto",
    hairStyle: "long" as const,
    skin: "#6B3F2A",
    hair: "#1A120B",
    top: "#C9B8E8",
    bottom: "#8B6DB8",
    nameColor: "#3A2A55",
  },
  {
    id: "homem-loiro",
    label: "Homem loiro",
    hairStyle: "short" as const,
    skin: "#F3C7A8",
    hair: "#E8C84A",
    top: "#A8C8F0",
    bottom: "#3F6FD0",
    nameColor: "#1E3A6B",
  },
  {
    id: "homem-moreno",
    label: "Homem moreno",
    hairStyle: "short" as const,
    skin: "#C68642",
    hair: "#5C3A1E",
    top: "#A8D4A0",
    bottom: "#3F9A55",
    nameColor: "#1E4A28",
  },
  {
    id: "homem-preto",
    label: "Homem cabelo preto",
    hairStyle: "short" as const,
    skin: "#6B3F2A",
    hair: "#1A120B",
    top: "#F0C0A0",
    bottom: "#B86A48",
    nameColor: "#5A2E1E",
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function isValidAvatarId(value: string): value is AvatarId {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function getAvatar(id: string | null | undefined) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export const DEFAULT_AVATAR_ID: AvatarId = "mulher-loira";
