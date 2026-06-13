export const GOODBYE_WORD = "adeus";

export function isGoodbyeMessage(content: string): boolean {
  return content.trim().toLowerCase() === GOODBYE_WORD;
}
