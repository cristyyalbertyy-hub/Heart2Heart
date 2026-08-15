export const VOICE_PREFIX = "voice:";
export const MAX_VOICE_SECONDS = 30;
export const MAX_VOICE_BYTES = 350_000;

export function isVoiceContent(content: string) {
  return content.startsWith(VOICE_PREFIX);
}

export function encodeVoiceMessage(dataUrl: string) {
  return `${VOICE_PREFIX}${dataUrl}`;
}

export function decodeVoiceMessage(content: string) {
  if (!isVoiceContent(content)) return null;
  return content.slice(VOICE_PREFIX.length);
}

export function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read audio."));
    };
    reader.onerror = () => reject(new Error("Could not read audio."));
    reader.readAsDataURL(blob);
  });
}
