const GOODBYE_WORDS = new Set(["adeus", "goodbye"]);

export function isGoodbyeMessage(content: string): boolean {
  return GOODBYE_WORDS.has(content.trim().toLowerCase());
}
