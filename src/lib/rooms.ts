const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const ROOM_CODE_LENGTH = 6;
export const MAX_MEMBERS = 12;

export function generateRoomCode(length = ROOM_CODE_LENGTH) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function normalizeRoomCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function normalizeDisplayName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function nameKeyFromDisplayName(name: string) {
  return normalizeDisplayName(name).toLowerCase();
}

export function isValidDisplayName(name: string) {
  const normalized = normalizeDisplayName(name);
  return normalized.length >= 2 && normalized.length <= 24;
}

export function isValidPin(pin: string) {
  return /^\d{4}$/.test(pin);
}

export function isValidRoomCode(code: string) {
  return new RegExp(`^[${CODE_ALPHABET}]{${ROOM_CODE_LENGTH}}$`).test(code);
}
