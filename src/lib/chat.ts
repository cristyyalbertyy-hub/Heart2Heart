export const GOODBYE_WORD = "goodbye";

export function isGoodbyeMessage(content: string): boolean {
  return content.trim().toLowerCase() === GOODBYE_WORD;
}
